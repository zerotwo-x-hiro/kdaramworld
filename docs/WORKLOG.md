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

---

## Phase 1: Foundation & K-Theme Design System

### 1. Architectural Scaffolding
- Initialized core application architecture: `app/`, `components/`, `lib/`, `supabase/migrations/`, `scripts/`, `tests/`, `docs/`.
- Configured Next.js 15 App Router, TypeScript strict mode, Tailwind CSS with raw RGB CSS variables wrapped as `rgb(var(--token) / <alpha-value>)`.

### 2. Self-Hosted Typography Pipeline
- Built `scripts/download-fonts.ts` to download and self-host Open Font License (OFL) fonts:
  - Cormorant Garamond (Latin Display)
  - Gowun Batang (Hangul Display Serif)
  - Pretendard (UI Sans, Korean + Latin)
  - Black Han Sans (Hangul Accent mark)
- Integrated via `next/font/local` in `lib/fonts.ts` with `font-display: swap` and zero runtime external CDN requests.

### 3. Dual-Theme System (Seoul Night & Hanji Day)
- **Seoul Night (Dark, Default):** Ink navy-black base, layered slate surfaces, soft Han River street neon accents (coral-red, celadon-teal, gold), subtle bokeh ambient glows.
- **Hanji Day (Light):** Warm hanji-paper cream background (`#f9f6ee`) with subtle paper-fiber radial texture, calligraphic ink typography, mineral cinnabar red, royal indigo, and jade celadon highlights.
- **Zero Flash Theme Toggle:** Implemented `<ThemeToggle>` and inline pre-paint script reading `localStorage.getItem('kdrama-theme')`, respecting `prefers-color-scheme` on first visit.
- **Theme-Flipping Tint Tokens:** Replaced arbitrary `bg-white/10` with `rgb(var(--tint-subtle))`, `rgb(var(--tint-medium))`, `rgb(var(--tint-strong))`.

### 4. Cultural K-Theme Component Suite (`components/k-theme/`)
- `DancheongBand`: Five-color Obangsaek geometric divider and header motif.
- `PatternBackground`: Authentic abstract SVG patterns (*Gurum* cloud, *Kkotsal* lattice, *Mulgyeol* wave, *Yeondwae* lotus) at non-intrusive 3–5% opacity.
- `HangulWatermark`: Faint large calligraphic watermarks (*사랑, 이야기, 드라마, 인연, 여운, 기억*).
- `BilingualLabel`: Clean paired Korean + Latin tags with `lang="ko"`.
- `FourCutFrame`: Korean photo booth four-cut (*인생네컷*) frame with film borders, cut counter, and barcode stamps.
- `TicketStubFrame`: Traditional perforated cinema ticket stub with validation stamps.
- `HanokFrame`: Traditional Korean Hanok window framing with wooden cheoma corner brackets.
- `CherryBlossomPetals`: Falling sakura petal micro-animation for milestone celebrations.

### 5. Layout & Global UX
- Built sticky blurred `<Navbar>`, responsive `<MobileDrawer>`, `<Footer>` with attributions, `<SkipLink>`, `<CommandPalette>` (Ctrl/Cmd+K), `<ToastProvider>`, `<ConfirmDialog>`, `<Skeleton>`, and themed `loading.tsx`, `not-found.tsx`, and `error.tsx`.
- Produced comprehensive documentation: `docs/DESIGN_SYSTEM.md` and `docs/KOREAN_COPY.md`.

### 6. Verification
- `npm run typecheck`: Passed with 0 errors.
- `npm test`: Vitest passed (3/3 unit tests).
- `npm run build`: Production build succeeded cleanly.

---

## Phase 2: Live Data Pipeline & Status Engine

### 1. Database Schema & Migration Architecture
- Created idempotent initial schema migration in `supabase/migrations/20261028000000_initial_schema.sql` covering:
  - `dramas`: `tmdb_id`, `slug`, `title`, `title_ko`, `synopsis`, `poster_path`, `backdrop_path`, `first_air_date`, `last_air_date`, `next_episode_air_date`, `next_episode_number`, `last_episode_number`, `number_of_episodes`, `number_of_seasons`, `tmdb_status`, `networks`, `runtime`, `original_language`, `synced_at`, `sync_error`.
  - `genres` and `drama_genres`: standard TV genre taxonomy with Korean translations.
  - `moods` and `drama_moods`: curated Korean mood taxonomy (Healing/힐링, Melancholy/먹먹한, Romance/심쿵, Thriller/스릴러, etc.).
  - `people` and `drama_cast`: top billed actors with Korean names and character roles.
  - `episodes`: season, episode number, air date, title, still path.
  - `drama_ratings`: multi-source ratings (`tmdb`, `imdb`) with score, vote count, source URL, and `fetched_at` timestamp.
  - `app_settings`: quota tracking (`omdb_quota`) and system preferences.
  - User and tracking tables: `users`, `user_sessions`, `collection_items`, `journal_notes` (strictly private), `reviews`, `lists`, `list_items`, `rankings`, `ranking_items`.
- Built migration runner `scripts/migrate.ts` tracking applied versions in `schema_migrations`.
- Applied migrations against real Postgres in development and testing.

### 2. Pure Status Derivation Engine (`lib/drama-status.ts`)
- Pure, deterministic function `deriveDramaStatus(drama, now)` operating strictly in Korea Standard Time (Asia/Seoul, UTC+9).
- **Core Invariant Enforced:** If `first_air_date` is on or before today in KST, it is mathematically impossible to categorize the title as `'upcoming'`.
- Accurately computes flips:
  - `upcoming` -> `airing` on premiere date in KST.
  - `airing` -> `ended` when `tmdb_status === 'Ended'` or all known episodes have aired.

### 3. TMDB Ingestion & Sync Engine (`lib/sync/tmdb-sync.ts`)
- Server-only background sync client connecting to TMDB API:
  - `/discover/tv` with `with_origin_country=KR`, `with_original_language=ko`, paginated.
  - `/tv/on_the_air` to capture live broadcast schedules and next episode dates.
  - Detailed `/tv/{id}` + credits + season episodes.
- Exponential backoff retry handler (`fetchTmdbWithRetry`) handling HTTP 429 (rate limits) and HTTP 5xx errors.
- Soft error handling: logs sync errors into `dramas.sync_error` without crashing pages or terminating the sync batch.

### 4. IMDb Ratings via OMDb API (`lib/sync/imdb-ratings.ts`)
- Mapped from TMDB's `external_ids.imdb_id`.
- Rate-limiting rules:
  - Titles refreshed at most once per 7 days (`fetched_at < NOW() - INTERVAL '7 days'`).
  - Stored independently as `source = 'imdb'` in `drama_ratings` (never averaged with TMDB).
  - Daily quota enforcement: caps at 900 calls/day (under free tier 1,000 threshold), stores usage in `app_settings.omdb_quota`, halts cleanly and resumes next run.
- Optional TVmaze cross-check implemented in `lib/sync/tvmaze.ts`.

### 5. Automated Cron & Health Endpoints
- `POST /api/cron/sync-dramas`: Protected by `Authorization: Bearer ${CRON_SECRET}`, performs incremental catalog sync and revalidates cached tags.
- `POST /api/cron/sync-ratings`: Protected by `Authorization: Bearer ${CRON_SECRET}`, syncs oldest IMDb ratings within quota.
- `GET /api/health`: Healthcheck endpoint querying database and returning `{ ok: true, dramas: count }` or 503 on database failure.
- Configured daily Vercel cron in `vercel.json` and 6-hour workflow in `.github/workflows/sync.yml`.

### 6. Artwork & Verification
- `DramaPoster`: TMDB image component with Next.js image optimization, responsive sizes, and traditional K-theme lattice fallback plate (no fake posters).
- `RatingChip`: Explicit source labeling ("TMDB 8.4", "IMDb 8.1", "Not rated").
- Verified against real Docker PostgreSQL test database (`TEST_DATABASE_URL`):
  - Vitest test suite: 23 passed across status boundary flips, mock 429/500 retries, real Postgres drama ingestion, and OMDb quota limits.
  - `npm run typecheck` and `npm run build` passed cleanly.


