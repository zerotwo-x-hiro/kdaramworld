import 'server-only';
import { query } from '@/lib/db';
import { env } from '@/lib/env';
import { fetchTmdbWithRetry } from './tmdb-sync';

export interface ImdbSyncSummary {
  checked: number;
  updated: number;
  failed: number;
  quotaReached: boolean;
  skipped?: boolean;
  reason?: string;
  durationMs?: number;
}

const OMDB_API_BASE = 'https://www.omdbapi.com/';
const DAILY_QUOTA_MAX = 900; // Safe threshold below 1,000/day free limit

interface OmdbDailyUsage {
  date: string;
  callsToday: number;
}

async function getOmdbUsageToday(): Promise<OmdbDailyUsage> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const res = await query<{ value: OmdbDailyUsage }>(
      `SELECT value FROM app_settings WHERE key = 'omdb_quota'`
    );
    if (res.rows.length > 0 && res.rows[0].value.date === today) {
      return res.rows[0].value;
    }
  } catch (e) {
    console.warn('[IMDb Sync] Could not read omdb_quota app_setting:', e);
  }
  return { date: today, callsToday: 0 };
}

async function incrementOmdbUsage(current: OmdbDailyUsage): Promise<void> {
  const updated: OmdbDailyUsage = {
    date: current.date,
    callsToday: current.callsToday + 1,
  };
  try {
    await query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('omdb_quota', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_at = NOW()`,
      [JSON.stringify(updated)]
    );
  } catch (e) {
    console.warn('[IMDb Sync] Could not update omdb_quota:', e);
  }
}

export async function fetchImdbRatingFromOmdb(imdbId: string, apiKey?: string): Promise<{ score: number; votes: number } | null> {
  const key = apiKey || env.OMDB_API_KEY;
  if (!key) return null;

  const url = `${OMDB_API_BASE}?i=${encodeURIComponent(imdbId)}&apikey=${encodeURIComponent(key)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`OMDb HTTP error: ${res.status}`);
  }

  const data = await res.json();
  if (data.Response === 'False' || !data.imdbRating || data.imdbRating === 'N/A') {
    return null;
  }

  const score = parseFloat(data.imdbRating);
  const votes = data.imdbVotes ? parseInt(data.imdbVotes.replace(/,/g, ''), 10) : 0;
  if (isNaN(score)) return null;

  return { score, votes: isNaN(votes) ? 0 : votes };
}

export async function runImdbRatingsSync(options: { maxTitles?: number } = {}): Promise<ImdbSyncSummary> {
  const startTime = Date.now();
  const summary: ImdbSyncSummary = {
    checked: 0,
    updated: 0,
    failed: 0,
    quotaReached: false,
  };

  if (!env.OMDB_API_KEY) {
    console.log('[IMDb Sync] Skipping IMDb sync: OMDB_API_KEY not configured.');
    return {
      ...summary,
      skipped: true,
      reason: 'OMDB_API_KEY is not configured in environment.',
      durationMs: Date.now() - startTime,
    };
  }

  const { maxTitles = 50 } = options;
  const usage = await getOmdbUsageToday();

  if (usage.callsToday >= DAILY_QUOTA_MAX) {
    console.warn(`[IMDb Sync] Daily quota limit reached (${usage.callsToday}/${DAILY_QUOTA_MAX}). Halting safely.`);
    return {
      ...summary,
      quotaReached: true,
      reason: `Daily OMDb limit (${DAILY_QUOTA_MAX}) reached for ${usage.date}. Will resume tomorrow.`,
      durationMs: Date.now() - startTime,
    };
  }

  // Find candidate dramas:
  // 1. Never fetched, or fetched more than 7 days ago
  // 2. Ordered by oldest fetched_at first
  const candidatesRes = await query<{ id: number; tmdb_id: number; title: string }>(
    `SELECT d.id, d.tmdb_id, d.title
     FROM dramas d
     LEFT JOIN drama_ratings dr ON d.id = dr.drama_id AND dr.source = 'imdb'
     WHERE d.tmdb_id IS NOT NULL
       AND (dr.fetched_at IS NULL OR dr.fetched_at < NOW() - INTERVAL '7 days')
     ORDER BY dr.fetched_at ASC NULLS FIRST
     LIMIT $1`,
    [maxTitles]
  );

  for (const drama of candidatesRes.rows) {
    if (usage.callsToday >= DAILY_QUOTA_MAX) {
      summary.quotaReached = true;
      break;
    }

    summary.checked++;

    try {
      // 1. Fetch TMDB external IDs to get imdb_id
      const externalIds = await fetchTmdbWithRetry<any>(`/tv/${drama.tmdb_id}/external_ids`);
      const imdbId = externalIds?.imdb_id;

      if (!imdbId) {
        // No IMDb ID mapped on TMDB; update fetched_at to avoid re-checking repeatedly
        await query(
          `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
           VALUES ($1, 'imdb', 0, 0, NULL, NOW())
           ON CONFLICT (drama_id, source) DO UPDATE SET fetched_at = NOW()`,
          [drama.id]
        );
        continue;
      }

      // 2. Call OMDb API for IMDb rating & vote count
      const rating = await fetchImdbRatingFromOmdb(imdbId);
      usage.callsToday++;
      await incrementOmdbUsage(usage);

      if (rating) {
        await query(
          `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
           VALUES ($1, 'imdb', $2, $3, $4, NOW())
           ON CONFLICT (drama_id, source) DO UPDATE SET
             score = EXCLUDED.score,
             votes = EXCLUDED.votes,
             url = EXCLUDED.url,
             fetched_at = NOW()`,
          [drama.id, rating.score, rating.votes, `https://www.imdb.com/title/${imdbId}/`]
        );
        summary.updated++;
      } else {
        // Mark checked even if unrated on IMDb
        await query(
          `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
           VALUES ($1, 'imdb', 0, 0, $2, NOW())
           ON CONFLICT (drama_id, source) DO UPDATE SET fetched_at = NOW()`,
          [drama.id, `https://www.imdb.com/title/${imdbId}/`]
        );
      }
    } catch (err) {
      summary.failed++;
      console.error(`[IMDb Sync] Error updating drama id=${drama.id}:`, err);
    }
  }

  summary.durationMs = Date.now() - startTime;
  console.log('[IMDb Sync] Completed:', summary);
  return summary;
}
