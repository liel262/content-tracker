-- ============================================================
-- Content Tracker — Full Migration
-- Run this in your Supabase SQL editor.
-- Safe to run on a fresh project OR an existing one with data.
-- ============================================================

-- ── 1. posts ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'missing',
  link       TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrate legacy status values (no data loss)
UPDATE posts SET status = 'pending_approval' WHERE status = 'ready';

-- Drop old constraint if it exists, then add updated one
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
ALTER TABLE posts ADD CONSTRAINT posts_status_check
  CHECK (status IN ('missing', 'in_progress', 'pending_approval', 'approved', 'published'));

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_posts" ON posts;
CREATE POLICY "public_posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;


-- ── 2. notes ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  author     TEXT        NOT NULL DEFAULT 'אנונימי',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_notes" ON notes;
CREATE POLICY "public_notes" ON notes FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notes;


-- ── 3. Auto-update updated_at on posts ────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON posts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
