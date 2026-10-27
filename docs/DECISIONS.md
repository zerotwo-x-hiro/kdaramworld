# Architectural & Product Decisions

## ADR-001: Mode Detection (BUILD Mode)
- **Status:** Accepted
- **Date:** 2026-10-27
- **Context:** The workspace `/workspaces/kdaramworld` was inspected in Phase 0. It contains only an initial commit with a bare `README.md` (`# kdaramworld`) and `.git`. There is no pre-existing Next.js or Supabase codebase in the repo.
- **Decision:** Operate in **BUILD mode**. Build the complete greenfield application following the full production specification.

## ADR-002: Product Identity & Korean Sub-Tagline
- **Status:** Accepted
- **Date:** 2026-10-27
- **Context:** The product is `kdramaworld` (display wordmark: `KDramaWorld` with Hangul accent mark). The English tagline is *"Some stories never leave you."* A natural, culturally resonant Korean sub-tagline was required.
- **Korean Sub-tagline Selected:** **"어떤 이야기는 영원히 마음에 남는다"**
  - *Linguistic Verification:*
    - "어떤 이야기는" (Some stories) - sets an introspective, literary tone.
    - "영원히" (forever / eternally) - evokes enduring emotional impact.
    - "마음에 남는다" (remain in the heart / linger) - standard Korean cinematic idiom for stories that stay with you long after watching, far more natural than literal translation ("떠나지 않는다" which can sound translated/unnatural).
  - *Accent Mark:* A refined Hangul typography badge `케이·드라마·월드` and seal mark accent `[ 韓 ]` / `[ 劇 ]`.

## ADR-003: Core Technology Stack
- **Status:** Accepted
- **Date:** 2026-10-27
- **Decisions:**
  - **Framework:** Next.js 15 App Router with TypeScript `strict: true`.
  - **Styling:** Tailwind CSS with CSS variable channel tokens (`rgb(var(--token) / <alpha-value>)`).
  - **Database & Pooling:** PostgreSQL accessed via `pg` (Pool), connecting to Supabase pooled connection string (`transaction` mode on port 6543 for serverless).
  - **Migration Management:** Idempotent SQL migrations placed in `supabase/migrations/` and recorded in a `schema_migrations` table via a custom migration runner script `scripts/migrate.ts`.
  - **Validation:** Zod schemas across all server actions, API routes, and environment configuration.
  - **Testing:**
    - Unit & Integration: Vitest against real PostgreSQL instance (`TEST_DATABASE_URL`).
    - E2E: Playwright in headless Chromium/Firefox/WebKit with `@axe-core/playwright` accessibility audits.
  - **Deploy Target:** Vercel serverless functions (no local file writes at runtime).
  - **Typography:** Self-hosted open-source fonts via `next/font/local`:
    - Display Latin: Cormorant Garamond (OFL)
    - Display Hangul: Gowun Batang / Noto Serif KR (OFL)
    - UI: Pretendard (SIL OFL)
    - Accent: Black Han Sans (OFL)

## ADR-004: Drama Status Derivation (Zero Stale "Upcoming" Titles)
- **Status:** Accepted
- **Date:** 2026-10-27
- **Context:** Many drama tracking sites suffer from stale "upcoming" labels on dramas that aired years ago because status is statically seeded or calculated solely based on release year.
- **Decision:**
  - Single pure function `deriveDramaStatus(drama, now)` in `lib/drama-status.ts`.
  - Canonical time zone: **Korea Standard Time (KST, Asia/Seoul, UTC+9)**.
  - Rules:
    - If `first_air_date` is strictly in the future (or missing with status in `Planned` / `In Production`), status is `upcoming`.
    - If `first_air_date` is today or earlier in KST:
      - If TMDB status is `Ended` / `Canceled`, or all known episodes have aired -> `ended`.
      - If returning series, or has an un-aired next episode, or recent air date without all episodes concluded -> `airing`.
      - **Invariable invariant:** A drama with a past `first_air_date` can **NEVER** be categorized as `upcoming`.
  - Used uniformly across card badges, filters, search queries, rails, detail pages, and collection lists.

## ADR-005: Authentication & Session Architecture
- **Status:** Accepted
- **Date:** 2026-10-27
- **Context:** Secure user authentication without third-party vendor lock-in.
- **Decision:**
  - Password hashing via Node.js native `crypto.scrypt` with per-user cryptographically secure salt.
  - Sessions: 30-day session tokens stored as HMAC-SHA256 hashes in `user_sessions` table.
  - Cookies: `httpOnly`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`.
  - Middleware fast path for cookie presence; authoritative authorization re-verified inside every server action and route handler.
