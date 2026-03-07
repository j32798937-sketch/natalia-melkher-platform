/**
 * PostgreSQL Schema Definition
 *
 * Creates all tables for the Natalia Melkher platform on PostgreSQL.
 * Use for Vercel / serverless deployment with DATABASE_URL.
 */

const SCHEMA_SQL = `
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'author')),
  avatar      TEXT DEFAULT NULL,
  bio         TEXT DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  color       TEXT DEFAULT '#8B7355',
  icon        TEXT DEFAULT '✦',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  author_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id   INTEGER DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
  content       TEXT NOT NULL,
  excerpt       TEXT DEFAULT NULL,
  cover_image   TEXT DEFAULT NULL,
  type          TEXT NOT NULL DEFAULT 'poetry' CHECK (type IN ('poetry', 'prose', 'essay', 'reflection', 'diary')),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured      SMALLINT NOT NULL DEFAULT 0,
  reading_time  INTEGER NOT NULL DEFAULT 1,
  views         INTEGER NOT NULL DEFAULT 0,
  meta_title    TEXT DEFAULT NULL,
  meta_desc     TEXT DEFAULT NULL,
  published_at  TIMESTAMPTZ DEFAULT NULL,
  language      TEXT DEFAULT 'ru',
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- POST_TAGS
CREATE TABLE IF NOT EXISTS post_tags (
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id      INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- TRANSLATIONS
CREATE TABLE IF NOT EXISTS translations (
  id              SERIAL PRIMARY KEY,
  post_id         INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  locale          TEXT NOT NULL CHECK (locale IN ('ru', 'en', 'de', 'fr', 'cn', 'kr')),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  excerpt         TEXT DEFAULT NULL,
  meta_title      TEXT DEFAULT NULL,
  meta_desc       TEXT DEFAULT NULL,
  ai_translated   SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, locale)
);

-- MEDIA
CREATE TABLE IF NOT EXISTS media (
  id              SERIAL PRIMARY KEY,
  filename        TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  size            INTEGER NOT NULL,
  path            TEXT NOT NULL,
  alt_text        TEXT DEFAULT NULL,
  width           INTEGER DEFAULT NULL,
  height          INTEGER DEFAULT NULL,
  uploaded_by     INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id          SERIAL PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ANALYTICS
CREATE TABLE IF NOT EXISTS analytics (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER DEFAULT NULL REFERENCES posts(id) ON DELETE SET NULL,
  event       TEXT NOT NULL,
  data        TEXT DEFAULT NULL,
  ip          TEXT DEFAULT NULL,
  user_agent  TEXT DEFAULT NULL,
  locale      TEXT DEFAULT NULL,
  referrer    TEXT DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_slug        ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status      ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type        ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author      ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_featured    ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_published   ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_created     ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_status_type ON posts(status, type);
CREATE INDEX IF NOT EXISTS idx_posts_status_pub  ON posts(status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_translations_post   ON translations(post_id);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations(locale);
CREATE INDEX IF NOT EXISTS idx_translations_pair   ON translations(post_id, locale);

CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_analytics_post    ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event   ON analytics(event);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Full-text search (tsvector)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(search_vector);

CREATE OR REPLACE FUNCTION posts_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.excerpt, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_search_update ON posts;
CREATE TRIGGER posts_search_update
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE posts_search_trigger();

-- Backfill search_vector for existing rows
UPDATE posts SET search_vector =
  setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(content, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(excerpt, '')), 'C')
WHERE search_vector IS NULL;
`

export const POSTGRES_SCHEMA = SCHEMA_SQL
