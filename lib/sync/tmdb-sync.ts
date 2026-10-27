import 'server-only';
import { pool, query } from '@/lib/db';
import { env } from '@/lib/env';

export interface SyncSummary {
  checked: number;
  updated: number;
  newDramas: number;
  failed: number;
  skipped?: boolean;
  reason?: string;
  durationMs?: number;
}

const TMDB_API_BASE = 'https://api.themoviedb.org/3';

function slugify(title: string, tmdbId: number): string {
  const clean = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean ? `${clean}-${tmdbId}` : `drama-${tmdbId}`;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTmdbWithRetry<T>(
  endpoint: string,
  token?: string,
  maxRetries = 3
): Promise<T | null> {
  const authToken = token !== undefined ? token : env.TMDB_ACCESS_TOKEN;
  if (!authToken) {
    console.warn('[TMDB Sync] TMDB_ACCESS_TOKEN is not configured.');
    return null;
  }

  const url = `${TMDB_API_BASE}${endpoint}`;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
        cache: 'no-store',
      });

      if (res.status === 429) {
        attempt++;
        const backoffMs = Math.pow(2, attempt) * 500;
        console.warn(`[TMDB Sync] Rate limited (429). Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
        continue;
      }

      if (res.status >= 500) {
        attempt++;
        const backoffMs = Math.pow(2, attempt) * 400;
        console.warn(`[TMDB Sync] Server error (${res.status}). Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
        continue;
      }

      if (!res.ok) {
        if (res.status === 404) {
          console.warn(`[TMDB Sync] Resource not found (404) at ${endpoint}`);
          return null;
        }
        const text = await res.text();
        throw new Error(`TMDB HTTP ${res.status}: ${text}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      await sleep(Math.pow(2, attempt) * 300);
    }
  }

  return null;
}

export async function syncDramaByTmdbId(tmdbId: number): Promise<{ isNew: boolean; dramaId: number }> {
  const data = await fetchTmdbWithRetry<any>(
    `/tv/${tmdbId}?append_to_response=credits,external_ids`
  );

  if (!data) {
    throw new Error(`Drama with TMDB ID ${tmdbId} could not be retrieved`);
  }

  const title = data.name || data.original_name || `K-Drama ${tmdbId}`;
  const titleKo = data.original_language === 'ko' ? data.original_name : null;
  const slug = slugify(title, tmdbId);
  const synopsis = data.overview || null;
  const posterPath = data.poster_path || null;
  const backdropPath = data.backdrop_path || null;
  const firstAirDate = data.first_air_date || null;
  const lastAirDate = data.last_air_date || null;
  const nextEpisode = data.next_episode_to_air;
  const lastEpisode = data.last_episode_to_air;
  const nextEpisodeAirDate = nextEpisode?.air_date || null;
  const nextEpisodeNumber = nextEpisode?.episode_number || null;
  const lastEpisodeNumber = lastEpisode?.episode_number || null;
  const numberOfEpisodes = data.number_of_episodes || null;
  const numberOfSeasons = data.number_of_seasons || 1;
  const tmdbStatus = data.status || null;
  const networks = Array.isArray(data.networks) ? data.networks.map((n: any) => n.name) : [];
  const runtime = Array.isArray(data.episode_run_time) && data.episode_run_time.length > 0
    ? data.episode_run_time[0]
    : null;
  const originalLanguage = data.original_language || 'ko';

  // Check if exists
  const existingRes = await query<{ id: number }>('SELECT id FROM dramas WHERE tmdb_id = $1', [tmdbId]);
  const isNew = existingRes.rows.length === 0;

  // Upsert Drama
  const dramaRes = await query<{ id: number }>(
    `INSERT INTO dramas (
      tmdb_id, slug, title, title_ko, synopsis, poster_path, backdrop_path,
      first_air_date, last_air_date, next_episode_air_date, next_episode_number,
      last_episode_number, number_of_episodes, number_of_seasons, tmdb_status,
      networks, runtime, original_language, synced_at, sync_error, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18, NOW(), NULL, NOW()
    )
    ON CONFLICT (tmdb_id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      title_ko = COALESCE(EXCLUDED.title_ko, dramas.title_ko),
      synopsis = COALESCE(EXCLUDED.synopsis, dramas.synopsis),
      poster_path = COALESCE(EXCLUDED.poster_path, dramas.poster_path),
      backdrop_path = COALESCE(EXCLUDED.backdrop_path, dramas.backdrop_path),
      first_air_date = EXCLUDED.first_air_date,
      last_air_date = EXCLUDED.last_air_date,
      next_episode_air_date = EXCLUDED.next_episode_air_date,
      next_episode_number = EXCLUDED.next_episode_number,
      last_episode_number = EXCLUDED.last_episode_number,
      number_of_episodes = EXCLUDED.number_of_episodes,
      number_of_seasons = EXCLUDED.number_of_seasons,
      tmdb_status = EXCLUDED.tmdb_status,
      networks = EXCLUDED.networks,
      runtime = COALESCE(EXCLUDED.runtime, dramas.runtime),
      original_language = EXCLUDED.original_language,
      synced_at = NOW(),
      sync_error = NULL,
      updated_at = NOW()
    RETURNING id`,
    [
      tmdbId, slug, title, titleKo, synopsis, posterPath, backdropPath,
      firstAirDate, lastAirDate, nextEpisodeAirDate, nextEpisodeNumber,
      lastEpisodeNumber, numberOfEpisodes, numberOfSeasons, tmdbStatus,
      networks, runtime, originalLanguage,
    ]
  );

  const dramaId = dramaRes.rows[0].id;

  // Upsert TMDB rating
  if (data.vote_average !== undefined && data.vote_average !== null) {
    const tmdbScore = Math.round(Number(data.vote_average) * 10) / 10;
    const voteCount = Number(data.vote_count) || 0;
    await query(
      `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
       VALUES ($1, 'tmdb', $2, $3, $4, NOW())
       ON CONFLICT (drama_id, source) DO UPDATE SET
         score = EXCLUDED.score,
         votes = EXCLUDED.votes,
         fetched_at = NOW()`,
      [dramaId, tmdbScore, voteCount, `https://www.themoviedb.org/tv/${tmdbId}`]
    );
  }

  // Upsert Genres
  if (Array.isArray(data.genres)) {
    for (const g of data.genres) {
      const gRes = await query<{ id: number }>('SELECT id FROM genres WHERE tmdb_id = $1', [g.id]);
      if (gRes.rows.length > 0) {
        await query(
          `INSERT INTO drama_genres (drama_id, genre_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [dramaId, gRes.rows[0].id]
        );
      }
    }
  }

  // Upsert Cast (Top 10 billed)
  if (data.credits && Array.isArray(data.credits.cast)) {
    const topCast = data.credits.cast.slice(0, 10);
    for (const actor of topCast) {
      if (!actor.id || !actor.name) continue;

      const personRes = await query<{ id: number }>(
        `INSERT INTO people (tmdb_id, name, profile_path)
         VALUES ($1, $2, $3)
         ON CONFLICT (tmdb_id) DO UPDATE SET
           name = EXCLUDED.name,
           profile_path = COALESCE(EXCLUDED.profile_path, people.profile_path)
         RETURNING id`,
        [actor.id, actor.name, actor.profile_path || null]
      );
      const personId = personRes.rows[0].id;

      await query(
        `INSERT INTO drama_cast (drama_id, person_id, character_name, cast_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (drama_id, person_id, character_name) DO UPDATE SET
           cast_order = EXCLUDED.cast_order`,
        [dramaId, personId, actor.character || '', actor.order || 0]
      );
    }
  }

  // Ingest Season 1 Episodes if available
  if (numberOfSeasons >= 1) {
    try {
      const seasonData = await fetchTmdbWithRetry<any>(`/tv/${tmdbId}/season/1`);
      if (seasonData && Array.isArray(seasonData.episodes)) {
        for (const ep of seasonData.episodes) {
          await query(
            `INSERT INTO episodes (drama_id, season, number, title, air_date, runtime, still_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (drama_id, season, number) DO UPDATE SET
               title = EXCLUDED.title,
               air_date = EXCLUDED.air_date,
               runtime = EXCLUDED.runtime,
               still_path = EXCLUDED.still_path`,
            [
              dramaId,
              ep.season_number || 1,
              ep.episode_number,
              ep.name || `Episode ${ep.episode_number}`,
              ep.air_date || null,
              ep.runtime || null,
              ep.still_path || null,
            ]
          );
        }
      }
    } catch (e) {
      console.warn(`[TMDB Sync] Could not fetch season 1 episodes for drama ${tmdbId}:`, e);
    }
  }

  return { isNew, dramaId };
}

export async function runTmdbSync(options: {
  maxDiscoveryPages?: number;
  maxOldestRefresh?: number;
  syncAiring?: boolean;
} = {}): Promise<SyncSummary> {
  const startTime = Date.now();
  const summary: SyncSummary = {
    checked: 0,
    updated: 0,
    newDramas: 0,
    failed: 0,
  };

  if (!env.TMDB_ACCESS_TOKEN) {
    console.log('[TMDB Sync] Skipping TMDB sync because TMDB_ACCESS_TOKEN is not configured.');
    return {
      ...summary,
      skipped: true,
      reason: 'TMDB_ACCESS_TOKEN is not set in environment.',
      durationMs: Date.now() - startTime,
    };
  }

  const { maxDiscoveryPages = 2, maxOldestRefresh = 5, syncAiring = true } = options;
  const processedTmdbIds = new Set<number>();

  // 1. Airing Now & Today's schedule
  if (syncAiring) {
    try {
      const onTheAir = await fetchTmdbWithRetry<any>('/tv/on_the_air');
      if (onTheAir && Array.isArray(onTheAir.results)) {
        for (const item of onTheAir.results) {
          if (item.origin_country?.includes('KR') || item.original_language === 'ko') {
            processedTmdbIds.add(item.id);
          }
        }
      }
    } catch (e) {
      console.warn('[TMDB Sync] Error fetching on_the_air:', e);
    }
  }

  // 2. Discover Korean Dramas (paginated)
  for (let page = 1; page <= maxDiscoveryPages; page++) {
    try {
      const discover = await fetchTmdbWithRetry<any>(
        `/discover/tv?with_origin_country=KR&with_original_language=ko&sort_by=popularity.desc&page=${page}`
      );
      if (discover && Array.isArray(discover.results)) {
        for (const item of discover.results) {
          processedTmdbIds.add(item.id);
        }
      }
    } catch (e) {
      console.warn(`[TMDB Sync] Error fetching discover page ${page}:`, e);
    }
  }

  // 3. Oldest synced dramas from DB to keep archive fresh
  try {
    const oldestRes = await query<{ tmdb_id: number }>(
      `SELECT tmdb_id FROM dramas
       WHERE tmdb_id IS NOT NULL
       ORDER BY synced_at ASC NULLS FIRST
       LIMIT $1`,
      [maxOldestRefresh]
    );
    for (const row of oldestRes.rows) {
      processedTmdbIds.add(row.tmdb_id);
    }
  } catch (e) {
    console.warn('[TMDB Sync] Error querying oldest dramas:', e);
  }

  // Ingest each drama sequentially with error boundary
  for (const tmdbId of processedTmdbIds) {
    summary.checked++;
    try {
      const result = await syncDramaByTmdbId(tmdbId);
      if (result.isNew) {
        summary.newDramas++;
      } else {
        summary.updated++;
      }
      await sleep(100); // small throttle to be polite to TMDB API
    } catch (err) {
      summary.failed++;
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[TMDB Sync] Failed syncing drama tmdb_id=${tmdbId}:`, errorMsg);
      // Soft failure: record error in DB if title exists
      await query(
        `UPDATE dramas SET sync_error = $1, updated_at = NOW() WHERE tmdb_id = $2`,
        [errorMsg, tmdbId]
      ).catch(() => {});
    }
  }

  summary.durationMs = Date.now() - startTime;
  console.log('[TMDB Sync] Finished:', summary);
  return summary;
}
