-- ============================================================
-- Projects: Game projects/works portfolio
-- ============================================================
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  cover_image_url TEXT,
  screenshots     JSONB DEFAULT '[]',
  video_url       TEXT,
  webgl_game_slug TEXT,
  download_links  JSONB DEFAULT '[]',
  tech_stack      JSONB DEFAULT '[]',
  category        TEXT DEFAULT 'game',
  tags            JSONB DEFAULT '[]',
  status          TEXT DEFAULT 'draft',
  dev_duration    TEXT,
  team_size       INT DEFAULT 1,
  my_role         TEXT,
  postmortem      TEXT,
  github_url      TEXT,
  featured        BOOLEAN DEFAULT FALSE,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Posts: Blog articles (admin dashboard CRUD)
-- ============================================================
CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  category        TEXT DEFAULT 'devlog',
  tags            JSONB DEFAULT '[]',
  status          TEXT DEFAULT 'draft',
  reading_time    INT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Timeline: Developer journey entries
-- ============================================================
CREATE TABLE timeline_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date            DATE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT DEFAULT 'learning',
  icon            TEXT,
  related_project UUID REFERENCES projects(id) ON DELETE SET NULL,
  links           JSONB DEFAULT '[]',
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Site settings: Key-value config store
-- ============================================================
CREATE TABLE site_settings (
  key             TEXT PRIMARY KEY,
  value           JSONB NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Contact messages: From the contact form
-- ============================================================
CREATE TABLE contact_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  message         TEXT NOT NULL,
  read            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Media: Track uploaded files metadata
-- ============================================================
CREATE TABLE media (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename        TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  mime_type       TEXT,
  size_bytes      BIGINT,
  alt_text        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

CREATE INDEX idx_timeline_date ON timeline_entries(date DESC);
CREATE INDEX idx_timeline_category ON timeline_entries(category);
