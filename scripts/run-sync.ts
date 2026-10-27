import dotenv from 'dotenv';
dotenv.config();

import { runTmdbSync } from '../lib/sync/tmdb-sync';
import { runImdbRatingsSync } from '../lib/sync/imdb-ratings';

async function main() {
  console.log('=== KDramaWorld Pipeline Sync ===');
  console.log('1. Starting TMDB Drama Catalog Sync...');
  const tmdbResult = await runTmdbSync({
    maxDiscoveryPages: 2,
    maxOldestRefresh: 10,
    syncAiring: true,
  });
  console.log('TMDB Sync Result:', tmdbResult);

  console.log('\n2. Starting IMDb Ratings Sync (OMDb API)...');
  const imdbResult = await runImdbRatingsSync({ maxTitles: 20 });
  console.log('IMDb Sync Result:', imdbResult);

  console.log('\n=== Sync Complete ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
