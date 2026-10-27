-- KDramaWorld Initial Schema Migration
-- Migration: 20261028000000_initial_schema.sql
-- Description: Core tables for dramas, episodes, cast, ratings, moods, genres, users, collections, journal, lists, and rankings.

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dramas Core Table
CREATE TABLE IF NOT EXISTS dramas (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ko TEXT,
  alt_titles TEXT[] DEFAULT '{}',
  synopsis TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  first_air_date DATE,
  last_air_date DATE,
  next_episode_air_date DATE,
  next_episode_number INTEGER,
  last_episode_number INTEGER,
  number_of_episodes INTEGER,
  number_of_seasons INTEGER DEFAULT 1,
  tmdb_status TEXT,
  networks TEXT[] DEFAULT '{}',
  runtime INTEGER,
  original_language TEXT DEFAULT 'ko',
  synced_at TIMESTAMPTZ,
  sync_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dramas_first_air_date ON dramas(first_air_date);
CREATE INDEX IF NOT EXISTS idx_dramas_next_episode_air_date ON dramas(next_episode_air_date);
CREATE INDEX IF NOT EXISTS idx_dramas_synced_at ON dramas(synced_at);
CREATE INDEX IF NOT EXISTS idx_dramas_title ON dramas(title);
CREATE INDEX IF NOT EXISTS idx_dramas_title_ko ON dramas(title_ko);

-- Genres Table
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  name_ko TEXT,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS drama_genres (
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (drama_id, genre_id)
);

-- Moods Table (Korean mood taxonomy: e.g. Healing/힐링, Melancholy/먹먹한, Heart-fluttering/심쿵, Thrilling/짜릿한)
CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS drama_moods (
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  mood_id INTEGER REFERENCES moods(id) ON DELETE CASCADE,
  PRIMARY KEY (drama_id, mood_id)
);

-- People (Cast and Crew)
CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  name_ko TEXT,
  profile_path TEXT,
  biography TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drama_cast (
  id SERIAL PRIMARY KEY,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
  character_name TEXT,
  cast_order INTEGER DEFAULT 0,
  UNIQUE(drama_id, person_id, character_name)
);

CREATE INDEX IF NOT EXISTS idx_drama_cast_drama ON drama_cast(drama_id);
CREATE INDEX IF NOT EXISTS idx_drama_cast_person ON drama_cast(person_id);

-- Episodes
CREATE TABLE IF NOT EXISTS episodes (
  id SERIAL PRIMARY KEY,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  season INTEGER NOT NULL DEFAULT 1,
  number INTEGER NOT NULL,
  title TEXT,
  air_date DATE,
  runtime INTEGER,
  still_path TEXT,
  UNIQUE(drama_id, season, number)
);

CREATE INDEX IF NOT EXISTS idx_episodes_drama_season ON episodes(drama_id, season);

-- Multi-Source Drama Ratings
CREATE TABLE IF NOT EXISTS drama_ratings (
  id SERIAL PRIMARY KEY,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'tmdb', 'imdb', 'mdl', 'viki'
  score NUMERIC(3, 1) NOT NULL,
  votes INTEGER DEFAULT 0,
  url TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(drama_id, source)
);

CREATE INDEX IF NOT EXISTS idx_drama_ratings_drama ON drama_ratings(drama_id);
CREATE INDEX IF NOT EXISTS idx_drama_ratings_source_score ON drama_ratings(source, score DESC);

-- App Settings (for featured drama, sync cursor, etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Sessions (HMAC-SHA256 token hash)
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expiry ON user_sessions(expires_at);

-- User Collection Tracking
CREATE TABLE IF NOT EXISTS collection_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped')),
  progress INTEGER DEFAULT 0,
  rating NUMERIC(3, 1),
  is_favourite BOOLEAN DEFAULT false,
  second_lead_syndrome BOOLEAN DEFAULT false,
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drama_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_user_status ON collection_items(user_id, status);

-- Private Journal Notes (Strictly private; NO public column exists)
CREATE TABLE IF NOT EXISTS journal_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  emotional_damage_level INTEGER CHECK (emotional_damage_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_notes_user_drama ON journal_notes(user_id, drama_id);

-- User Reviews (Public or Private)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  rating NUMERIC(3, 1),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drama_id)
);

-- Curated Lists
CREATE TABLE IF NOT EXISTS lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS list_items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  commentary TEXT,
  position INTEGER DEFAULT 0,
  UNIQUE(list_id, drama_id)
);

CREATE INDEX IF NOT EXISTS idx_list_items_list ON list_items(list_id, position);

-- Tier Rankings (dnd-kit reorderable)
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'all_time',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ranking_items (
  id SERIAL PRIMARY KEY,
  ranking_id INTEGER REFERENCES rankings(id) ON DELETE CASCADE,
  drama_id INTEGER REFERENCES dramas(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  notes TEXT,
  UNIQUE(ranking_id, drama_id)
);

CREATE INDEX IF NOT EXISTS idx_ranking_items_position ON ranking_items(ranking_id, position);
