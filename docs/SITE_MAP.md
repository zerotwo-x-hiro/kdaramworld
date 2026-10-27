# KDramaWorld Site Map & System Architecture

## 1. Routes (`app/`)

| Route | Purpose | Access | Rendering |
|---|---|---|---|
| `/` | Home page: Hanok-framed hero (5-title carousel, no autoplay), shortcuts, "Your drama journey", "Airing Now · 방영 중", "Coming Soon · 방영 예정", Top Rated, Curated shelves | Public / Personalised when logged in | Dynamic / ISR with tag |
| `/discover` | Discovery browser with live multi-filter (genre, mood, network, year, episodes, status, rating source) + 5 sorts + pagination in URL params | Public | Dynamic |
| `/search` | Full-text and phonetic search across titles (Hangul/Latin/Alt), actors, and genres | Public | Dynamic |
| `/drama/[id]` | Drama details: cinematic backdrop, sticky action bar, synopsis, cast carousel, episode guide, source-attributed ratings, related titles | Public | Dynamic / Cached per drama tag |
| `/actors` | Korean drama actors, directors, screenwriters directory | Public | Dynamic |
| `/actors/[id]` | Person filmography with drama credits and roles | Public | Dynamic |
| `/collection` | User tracking hub: Watching, Completed, Plan-to-watch, On-hold, Dropped, Favourites with progress bars & stats | Authenticated | Dynamic |
| `/journal` | Private personal journal notes & Emotional Damage Meter (tissue box, ramyeon, soju glass, rain icons) | Authenticated | Dynamic (Private) |
| `/lists` | Community and personal curated lists (Four-cut / 인생네컷 styling) | Public / Private | Dynamic |
| `/lists/[id]` | List view with custom notes, reorder preview, and share card | Public / Owner | Dynamic |
| `/rankings` | Personal drama rankings using dnd-kit (drag-and-drop & keyboard up/down buttons) | Public / Owner | Dynamic |
| `/midnight-watchlist` | Transparent rule-based recommendation engine ("What should I watch tonight?") with explicit match reasons | Public / Authenticated | Dynamic |
| `/wrapped/[year]` | Annual K-Drama Wrapped archive (completions, watch hours, top actors, print-to-PDF styles, ticket stub look) | Authenticated | Dynamic |
| `/profile/[username]` | Public profile and shelf showcase (respects private profile settings) | Public | Dynamic |
| `/settings` | Profile, privacy, password, and preference management | Authenticated | Dynamic |
| `/login` | User sign-in | Public | Dynamic |
| `/signup` | User account creation | Public | Dynamic |
| `/about` | Project philosophy, Hangul typography notes, TMDB/OMDb API attributions | Public | Static |
| `/admin` | Administrative portal: TMDB sync controls, sync logs, error counters, featured drama selector | Admin only | Dynamic |

## 2. API Routes (`app/api/`)

| Endpoint | Method | Security | Purpose |
|---|---|---|---|
| `/api/health` | GET | Public | Healthcheck returning `{ ok: true, dramas: count }` or `503` |
| `/api/search` | GET | Public (Rate-limited, Zod validated) | Autocomplete search API for title, actor, and genre queries |
| `/api/cron/sync-dramas` | POST | Bearer `${CRON_SECRET}` | Scheduled sync of airing, upcoming, and newly discovered K-dramas from TMDB |
| `/api/cron/sync-ratings` | POST | Bearer `${CRON_SECRET}` | Scheduled rate-limited IMDb ratings sync via OMDb API |

## 3. Server Actions

- **Auth Actions:**
  - `loginAction(formData)`: Validates credentials, issues 30-day session cookie.
  - `signupAction(formData)`: Creates user, hashes password via scrypt with unique salt, assigns initial admin role if email matches `ADMIN_EMAILS`.
  - `logoutAction()`: Invalidates session in database and clears auth cookie.
  - `updateSettingsAction(formData)`: Updates display name, bio, profile privacy, or password.
- **Collection Actions:**
  - `updateCollectionItemAction({ dramaId, status, progress, rating, isFavourite })`: Upserts tracking state.
  - `deleteCollectionItemAction({ dramaId })`: Removes drama from collection.
- **Journal & Review Actions:**
  - `saveJournalNoteAction({ dramaId, note, emotionalDamageLevel })`: Strictly private note entry.
  - `deleteJournalNoteAction({ noteId })`: Deletes private note.
  - `submitReviewAction({ dramaId, reviewText, isPublic, rating })`: Creates/updates review.
- **List & Ranking Actions:**
  - `createListAction({ title, description, visibility, dramaIds })`: Creates themed list.
  - `updateListAction({ listId, title, description, visibility, items })`: Updates list items and order.
  - `deleteListAction({ listId })`: Deletes list.
  - `saveRankingAction({ rankingId, items })`: Persists ordered items from dnd-kit ranking.
- **Admin Actions:**
  - `triggerManualSyncAction()`: Initiates sync immediately from admin UI (re-checking admin role).
  - `setFeaturedDramaAction({ dramaId })`: Updates hero featured selection.

## 4. Database Schema (`supabase/migrations/`)

1. `users`: `id`, `email`, `username`, `password_hash`, `salt`, `role`, `is_private`, `created_at`, `updated_at`
2. `user_sessions`: `id`, `user_id`, `token_hash`, `expires_at`, `created_at`
3. `dramas`: `id`, `tmdb_id`, `slug`, `title`, `title_ko`, `alt_titles`, `synopsis`, `poster_path`, `backdrop_path`, `first_air_date`, `last_air_date`, `next_episode_air_date`, `next_episode_number`, `last_episode_number`, `number_of_episodes`, `number_of_seasons`, `tmdb_status`, `networks`, `runtime`, `original_language`, `synced_at`, `sync_error`, `created_at`, `updated_at`
4. `genres`: `id`, `tmdb_id`, `name`, `name_ko`, `slug`
5. `drama_genres`: `drama_id`, `genre_id`
6. `moods`: `id`, `name`, `name_ko`, `slug`, `icon`
7. `drama_moods`: `drama_id`, `mood_id`
8. `people`: `id`, `tmdb_id`, `name`, `name_ko`, `profile_path`, `biography`
9. `drama_cast`: `id`, `drama_id`, `person_id`, `character_name`, `cast_order`
10. `episodes`: `id`, `drama_id`, `season_number`, `episode_number`, `title`, `air_date`, `runtime`, `still_path`
11. `drama_ratings`: `id`, `drama_id`, `source` ('tmdb', 'imdb', 'mdl'), `score`, `votes`, `url`, `fetched_at`
12. `collection_items`: `id`, `user_id`, `drama_id`, `status` ('watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped'), `progress`, `rating`, `is_favourite`, `second_lead_syndrome`, `started_at`, `completed_at`, `updated_at`
13. `journal_notes`: `id`, `user_id`, `drama_id`, `note_text`, `emotional_damage_level` (1..5), `created_at`, `updated_at`
14. `reviews`: `id`, `user_id`, `drama_id`, `review_text`, `rating`, `is_public`, `created_at`
15. `lists`: `id`, `user_id`, `title`, `description`, `visibility` ('public', 'unlisted', 'private'), `created_at`, `updated_at`
16. `list_items`: `id`, `list_id`, `drama_id`, `commentary`, `position`
17. `rankings`: `id`, `user_id`, `title`, `category`, `created_at`, `updated_at`
18. `ranking_items`: `id`, `ranking_id`, `drama_id`, `position`, `notes`
19. `app_settings`: `key`, `value`, `updated_at`
20. `schema_migrations`: `version`, `applied_at`

## 5. Core Server & Shared Modules (`lib/`)

- `lib/env.ts`: Central, server-only validated environment variables via Zod.
- `lib/db.ts`: Robust PostgreSQL connection pool via `pg` with query helper and transaction support.
- `lib/drama-status.ts`: Pure, deterministic function `deriveDramaStatus(drama, now)` operating in KST.
- `lib/permissions.ts`: Strict ownership and RBAC enforcement.
- `lib/auth.ts`: Secure cookie extraction, session verification, and password scrypt hashing.
- `lib/sync/tmdb-sync.ts`: TMDB TV API client with rate limiting, exponential backoff, and upsert logic.
- `lib/sync/imdb-ratings.ts`: OMDb API client for IMDb ratings with 7-day rate-limiting and daily quota management.
- `lib/recommender.ts`: Pure rule-based engine for Midnight Watchlist recommendations.
