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

