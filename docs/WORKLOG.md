# Engineering Worklog

## Phase 0: Recon & Baseline

### 1. Environment & Mode Detection
- **Inspected Workspace:** Checked directory contents, git history, and remotes.
- **Result:** Found only an initial commit with a bare `README.md` (`# kdaramworld`). No existing Next.js, database, or application code existed.
- **Mode Determined:** **BUILD mode**. Proceeding with full greenfield architecture adhering to all production requirements.
- **Branch Created:** `phase-0-recon`

### 2. Root Cause Analysis: Stale "Upcoming" Dramas Bug
In legacy tracking projects (such as `github.com/localghost09/kdrama` or similar catalog apps):
1. **Static Seeding Without Runtime Sync:** Catalogs were seeded once from static JSON files or initial scrapers. If a drama was scheduled for future broadcast at seed time (e.g. 2023), its database column `status` was set to `"upcoming"` and never updated.
2. **Year-Only or Missing Date Derivation:** Frontend components or SQL queries frequently checked `status = 'upcoming'` or compared only release years (`year >= current_year`), ignoring actual air dates (`first_air_date`, `next_episode_air_date`).
3. **Absence of Serverless Background Sync:** No automated cron jobs refreshed TMDB status (`Returning Series`, `Ended`) or episode airings.
4. **Stale Cache / Static Generation:** Static site generation (`force-static` or unlimited `revalidate`) froze the initial HTML rendered at deploy time.

**Solution Architecture in KDramaWorld:**
- **Single Source of Truth:** `deriveDramaStatus(drama, now)` in `lib/drama-status.ts`.
- **KST Timezone Enforcement:** Asia/Seoul UTC+9 used as the canonical reference for "today".
- **Strict Invariant:** If `first_air_date` is on or before today's date in KST, the title is mathematically guaranteed to never be classified as `upcoming`.
- **Automated Sync Engine:** TMDB cron endpoint (`/api/cron/sync-dramas`) updates episodes, broadcast status, and air dates, triggering immediate cache invalidation (`revalidateTag`).

### 3. Caching Audit & Architecture Plan
- **Dynamic Content:** User collections, journal notes, rankings, midnight watchlist, and search queries use dynamic rendering (`export const dynamic = 'force-dynamic'` or cookies/auth-dependent requests).
- **Public Catalog & Dramas:** Cached with tag-based revalidation (`revalidateTag('dramas')`, `revalidateTag('drama-[id]')`).
- **No Runtime Filesystem Writes:** Vercel serverless compliance. All persistence is in Postgres.
- **Cache Headers:** Prevent CDN caching on authenticated responses via `Cache-Control: private, no-store`.

### 4. Baseline Recorded
- Node: `v24.21.0`
- NPM: `12.2.1`
- Docker: operational (used for local PostgreSQL test database)
- Clean `.gitignore` created.
