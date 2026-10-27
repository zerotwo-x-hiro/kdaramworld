import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { query } from '@/lib/db';
import { deriveDramaStatus } from '@/lib/drama-status';
import { fetchTmdbWithRetry, syncDramaByTmdbId } from '@/lib/sync/tmdb-sync';
import { fetchImdbRatingFromOmdb, runImdbRatingsSync } from '@/lib/sync/imdb-ratings';
import { env } from '@/lib/env';

describe('Phase 2 Pipeline Integration Tests against Real Postgres', () => {
  beforeAll(() => {
    env.TMDB_ACCESS_TOKEN = 'test-tmdb-bearer-token';
    env.OMDB_API_KEY = 'test-omdb-api-key';
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Status Transitions & Flips', () => {
    it('proves upcoming -> airing flip on premiere date', () => {
      const dramaUpcoming = {
        first_air_date: '2026-10-29',
        number_of_episodes: 16,
        last_episode_number: 0,
        tmdb_status: 'Planned',
      };
      // Before premiere
      expect(deriveDramaStatus(dramaUpcoming, '2026-10-28T00:00:00Z')).toBe('upcoming');
      // On premiere date
      expect(deriveDramaStatus(dramaUpcoming, '2026-10-29T00:00:00Z')).toBe('airing');
    });

    it('proves airing -> ended flip once finale airs or status marks Ended', () => {
      const dramaAiring = {
        first_air_date: '2026-09-01',
        last_air_date: '2026-10-27',
        number_of_episodes: 16,
        last_episode_number: 15,
        next_episode_air_date: '2026-10-28',
        tmdb_status: 'Returning Series',
      };
      // Mid-broadcast
      expect(deriveDramaStatus(dramaAiring, '2026-10-27T00:00:00Z')).toBe('airing');

      // Finale concluded
      const dramaFinished = {
        ...dramaAiring,
        last_episode_number: 16,
        next_episode_air_date: null,
        tmdb_status: 'Ended',
      };
      expect(deriveDramaStatus(dramaFinished, '2026-10-28T12:00:00Z')).toBe('ended');
    });
  });

  describe('TMDB Client Error Handling & Rate Limiting', () => {
    it('gracefully skips when TMDB_ACCESS_TOKEN is missing', async () => {
      const result = await fetchTmdbWithRetry('/tv/12345', '');
      expect(result).toBeNull();
    });

    it('handles HTTP 429 rate limit with backoff and succeeds on retry', async () => {
      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return new Response(JSON.stringify({ status_message: 'Rate limit exceeded' }), {
            status: 429,
          });
        }
        return new Response(JSON.stringify({ id: 99999, name: 'Retry Success' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const res = await fetchTmdbWithRetry<any>('/tv/99999', 'mock-token', 3);
      expect(callCount).toBe(2);
      expect(res).not.toBeNull();
      expect(res.name).toBe('Retry Success');
    });

    it('handles HTTP 500 server error with backoff and succeeds on retry', async () => {
      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return new Response('Internal Server Error', { status: 500 });
        }
        return new Response(JSON.stringify({ id: 88888, name: 'Server Recovered' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const res = await fetchTmdbWithRetry<any>('/tv/88888', 'mock-token', 3);
      expect(callCount).toBe(2);
      expect(res.name).toBe('Server Recovered');
    });
  });

  describe('Real Postgres Ingestion: syncDramaByTmdbId', () => {
    it('discovers and ingests a new drama into Postgres test database', async () => {
      const mockTmdbData = {
        id: 777777,
        name: 'The Midnight Studio',
        original_name: '야한(夜限) 사진관',
        overview: 'A photographer who runs a photo studio only for ghosts meets a passionate lawyer.',
        poster_path: '/ghost_poster.jpg',
        backdrop_path: '/ghost_bg.jpg',
        first_air_date: '2024-03-11',
        last_air_date: '2024-05-06',
        number_of_episodes: 16,
        number_of_seasons: 1,
        status: 'Ended',
        original_language: 'ko',
        networks: [{ name: 'ENA' }],
        episode_run_time: [65],
        vote_average: 8.2,
        vote_count: 140,
        genres: [{ id: 18, name: 'Drama' }],
        credits: {
          cast: [
            { id: 11111, name: 'Joo Won', character: 'Seo Ki-joo', order: 0 },
            { id: 22222, name: 'Kwon Na-ra', character: 'Han Bom', order: 1 },
          ],
        },
      };

      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('/tv/777777/season/1')) {
          return new Response(JSON.stringify({ episodes: [] }), { status: 200 });
        }
        return new Response(JSON.stringify(mockTmdbData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const result = await syncDramaByTmdbId(777777);
      expect(result.dramaId).toBeGreaterThan(0);

      // Verify row exists in real Postgres
      const checkRes = await query<{ title: string; tmdb_score: string }>(
        `SELECT d.title, dr.score as tmdb_score
         FROM dramas d
         LEFT JOIN drama_ratings dr ON d.id = dr.drama_id AND dr.source = 'tmdb'
         WHERE d.tmdb_id = 777777`
      );

      expect(checkRes.rows.length).toBe(1);
      expect(checkRes.rows[0].title).toBe('The Midnight Studio');
      expect(parseFloat(checkRes.rows[0].tmdb_score)).toBe(8.2);
    });
  });

  describe('OMDb / IMDb Ratings Quota Management & Resume', () => {
    it('correctly parses OMDb API response with vote commas', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            Response: 'True',
            imdbRating: '8.7',
            imdbVotes: '34,510',
          }),
          { status: 200 }
        )
      );

      const rating = await fetchImdbRatingFromOmdb('tt1234567', 'mock-key');
      expect(rating).not.toBeNull();
      expect(rating?.score).toBe(8.7);
      expect(rating?.votes).toBe(34510);
    });

    it('stops cleanly and preserves quota when daily limit is hit', async () => {
      // Seed quota reached in app_settings
      const today = new Date().toISOString().slice(0, 10);
      await query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('omdb_quota', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [JSON.stringify({ date: today, callsToday: 950 })]
      );

      const summary = await runImdbRatingsSync({ maxTitles: 5 });
      expect(summary.quotaReached).toBe(true);
      expect(summary.reason).toContain('Daily OMDb limit');
    });
  });
});
