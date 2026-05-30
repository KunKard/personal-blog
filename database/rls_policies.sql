-- ============================================================
-- Row Level Security Policies
-- Run these in Supabase SQL Editor AFTER creating the tables
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Projects: Public read published, admin full access
-- ============================================================
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin manage projects"
  ON projects FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- Posts: Public read published, admin full access
-- ============================================================
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin manage posts"
  ON posts FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- Timeline: Public read all, admin full access
-- ============================================================
CREATE POLICY "Public read timeline"
  ON timeline_entries FOR SELECT
  USING (true);

CREATE POLICY "Admin manage timeline"
  ON timeline_entries FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- Site settings: Public read, admin write
-- ============================================================
CREATE POLICY "Public read settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin manage settings"
  ON site_settings FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- Contact messages: Admin only
-- ============================================================
CREATE POLICY "Admin manage messages"
  ON contact_messages FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone insert messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- Media: Public read, admin full access
-- ============================================================
CREATE POLICY "Public read media"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Admin manage media"
  ON media FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
