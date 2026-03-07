import { execScript, getDatabase, queryAll } from '@/lib/database/index'
import { databaseConfig } from '@/config/database.config'
import { POSTGRES_SCHEMA } from '@/lib/database/schema-pg'

/**
 * Database Schema Definition
 *
 * Creates all tables for the Natalia Melkher platform.
 * Uses IF NOT EXISTS to be safely re-runnable.
 */

const SCHEMA_SQL = `
-- ═══════════════════════════════════════════════════════════
-- USERS TABLE
-- Stores author/admin accounts
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT    NOT NULL UNIQUE,
  email       TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,
  role        TEXT    NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'author')),
  avatar      TEXT    DEFAULT NULL,
  bio         TEXT    DEFAULT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════════════════
-- SESSIONS TABLE
-- Stores active user sessions
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT    PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  expires_at  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════
-- CATEGORIES TABLE
-- Literary categories: poetry, prose, essays, etc.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT    DEFAULT NULL,
  color       TEXT    DEFAULT '#8B7355',
  icon        TEXT    DEFAULT '✦',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════════════════
-- TAGS TABLE
-- Tags for publications
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tags (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════════════════
-- POSTS TABLE
-- Main literary content: poems, stories, essays, etc.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL,
  slug          TEXT    NOT NULL UNIQUE,
  author_id     INTEGER NOT NULL,
  category_id   INTEGER DEFAULT NULL,
  content       TEXT    NOT NULL,
  excerpt       TEXT    DEFAULT NULL,
  cover_image   TEXT    DEFAULT NULL,
  type          TEXT    NOT NULL DEFAULT 'poetry' CHECK (type IN ('poetry', 'prose', 'essay', 'reflection', 'diary')),
  status        TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured      INTEGER NOT NULL DEFAULT 0,
  reading_time  INTEGER NOT NULL DEFAULT 1,
  views         INTEGER NOT NULL DEFAULT 0,
  meta_title    TEXT    DEFAULT NULL,
  meta_desc     TEXT    DEFAULT NULL,
  published_at  TEXT    DEFAULT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (author_id)   REFERENCES users(id)      ON DELETE RESTRICT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ═══════════════════════════════════════════════════════════
-- POST_TAGS TABLE
-- Many-to-many relationship between posts and tags
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS post_tags (
  post_id     INTEGER NOT NULL,
  tag_id      INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════
-- TRANSLATIONS TABLE
-- Stores translations of posts in different languages
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS translations (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id         INTEGER NOT NULL,
  locale          TEXT    NOT NULL CHECK (locale IN ('ru', 'en', 'de', 'fr', 'cn', 'kr')),
  title           TEXT    NOT NULL,
  content         TEXT    NOT NULL,
  excerpt         TEXT    DEFAULT NULL,
  meta_title      TEXT    DEFAULT NULL,
  meta_desc       TEXT    DEFAULT NULL,
  ai_translated   INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(post_id, locale),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════
-- MEDIA TABLE
-- Uploaded files (images, etc.)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS media (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  filename        TEXT    NOT NULL,
  original_name   TEXT    NOT NULL,
  mime_type       TEXT    NOT NULL,
  size            INTEGER NOT NULL,
  path            TEXT    NOT NULL,
  alt_text        TEXT    DEFAULT NULL,
  uploaded_by     INTEGER NOT NULL,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ═══════════════════════════════════════════════════════════
-- SETTINGS TABLE
-- Key-value store for platform settings
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS settings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  key         TEXT    NOT NULL UNIQUE,
  value       TEXT    NOT NULL,
  type        TEXT    NOT NULL DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ═══════════════════════════════════════════════════════════
-- ANALYTICS TABLE
-- Tracks page views, reading events, etc.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id     INTEGER DEFAULT NULL,
  event       TEXT    NOT NULL,
  data        TEXT    DEFAULT NULL,
  ip          TEXT    DEFAULT NULL,
  user_agent  TEXT    DEFAULT NULL,
  locale      TEXT    DEFAULT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- Performance optimization indexes
-- ═══════════════════════════════════════════════════════════

-- Posts indexes
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

-- Translations indexes
CREATE INDEX IF NOT EXISTS idx_translations_post   ON translations(post_id);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON translations(locale);
CREATE INDEX IF NOT EXISTS idx_translations_pair   ON translations(post_id, locale);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_post    ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event   ON analytics(event);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Full-text search on posts
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title,
  content,
  excerpt,
  content='posts',
  content_rowid='id',
  tokenize='unicode61'
);

-- Triggers to keep FTS index in sync
CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
  INSERT INTO posts_fts(rowid, title, content, excerpt)
  VALUES (new.id, new.title, new.content, new.excerpt);
END;

CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, content, excerpt)
  VALUES ('delete', old.id, old.title, old.content, old.excerpt);
END;

CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
  INSERT INTO posts_fts(posts_fts, rowid, title, content, excerpt)
  VALUES ('delete', old.id, old.title, old.content, old.excerpt);
  INSERT INTO posts_fts(rowid, title, content, excerpt)
  VALUES (new.id, new.title, new.content, new.excerpt);
END;

-- Trigger to auto-update updated_at on posts
CREATE TRIGGER IF NOT EXISTS posts_updated_at AFTER UPDATE ON posts
BEGIN
  UPDATE posts SET updated_at = datetime('now') WHERE id = new.id;
END;

-- Trigger to auto-update updated_at on translations
CREATE TRIGGER IF NOT EXISTS translations_updated_at AFTER UPDATE ON translations
BEGIN
  UPDATE translations SET updated_at = datetime('now') WHERE id = new.id;
END;

-- Trigger to auto-update updated_at on users
CREATE TRIGGER IF NOT EXISTS users_updated_at AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = new.id;
END;

-- Trigger to auto-update updated_at on settings
CREATE TRIGGER IF NOT EXISTS settings_updated_at AFTER UPDATE ON settings
BEGIN
  UPDATE settings SET updated_at = datetime('now') WHERE id = new.id;
END;
`;

/**
 * Initialize the database schema
 * Creates all tables, indexes, triggers, and FTS
 */
export async function initializeSchema(): Promise<void> {
  try {
    if (databaseConfig.provider === 'postgresql') {
      await execScript(POSTGRES_SCHEMA)
    } else {
      await execScript(SCHEMA_SQL)
    }
    console.log('[Melkher] Database schema initialized successfully')
  } catch (error) {
    console.error('[Melkher] Failed to initialize database schema:', error)
    throw error
  }
}

/**
 * Drop all tables (USE WITH CAUTION — development only)
 */
export async function dropAllTables(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot drop tables in production')
  }

  if (databaseConfig.provider === 'postgresql') {
    const dropSQL = `
    DROP TRIGGER IF EXISTS posts_search_update ON posts;
    DROP FUNCTION IF EXISTS posts_search_trigger();
    DROP TABLE IF EXISTS analytics CASCADE;
    DROP TABLE IF EXISTS settings CASCADE;
    DROP TABLE IF EXISTS media CASCADE;
    DROP TABLE IF EXISTS translations CASCADE;
    DROP TABLE IF EXISTS post_tags CASCADE;
    DROP TABLE IF EXISTS posts CASCADE;
    DROP TABLE IF EXISTS tags CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS sessions CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    `
    await execScript(dropSQL)
  } else {
  const dropSQL = `
    DROP TRIGGER IF EXISTS posts_ai;
    DROP TRIGGER IF EXISTS posts_ad;
    DROP TRIGGER IF EXISTS posts_au;
    DROP TRIGGER IF EXISTS posts_updated_at;
    DROP TRIGGER IF EXISTS translations_updated_at;
    DROP TRIGGER IF EXISTS users_updated_at;
    DROP TRIGGER IF EXISTS settings_updated_at;
    DROP TABLE IF EXISTS posts_fts;
    DROP TABLE IF EXISTS analytics;
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS media;
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS users;
  `

  await execScript(dropSQL)
  }
  console.log('[Melkher] All tables dropped')
}

/**
 * Verify that all expected tables exist
 */
export async function verifySchema(): Promise<{ valid: boolean; missing: string[] }> {
  const expectedTables = [
    'users',
    'sessions',
    'categories',
    'tags',
    'posts',
    'post_tags',
    'translations',
    'media',
    'settings',
    'analytics',
  ]

  if (databaseConfig.provider === 'postgresql') {
    const rows = await queryAll<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    )
    const existingNames = new Set(rows.map((r) => r.table_name))
    const missing = expectedTables.filter((t) => !existingNames.has(t))
    return { valid: missing.length === 0, missing }
  }

  const db = getDatabase()
  const existing = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
    .all() as { name: string }[]

  const existingNames = new Set(existing.map((t) => t.name))
  const missing = expectedTables.filter((t) => !existingNames.has(t))

  return {
    valid: missing.length === 0,
    missing,
  }
}