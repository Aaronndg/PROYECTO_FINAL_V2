-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood entries table
CREATE TABLE mood_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10) NOT NULL,
    mood_description TEXT NOT NULL,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellness content table for RAG
CREATE TABLE wellness_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('mindfulness', 'breathing', 'prayer', 'meditation', 'emergency')) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    embedding vector(1536), -- OpenAI embedding dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood_average DECIMAL(3,2),
    activities_completed INTEGER DEFAULT 0,
    goals_met INTEGER DEFAULT 0,
    reflection_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- N8N webhooks/automation logs
CREATE TABLE automation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts and resources
CREATE TABLE emergency_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tests psicológicos y espirituales
CREATE TABLE psychological_tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('emotional', 'spiritual', 'personality')),
  questions JSONB NOT NULL,
  duration INTEGER DEFAULT 15, -- duración en minutos
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions_count INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para resultados de tests de usuarios
CREATE TABLE user_test_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES psychological_tests(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  category_scores JSONB DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, test_id, completed_at)
);

-- Tabla para notas comunitarias
CREATE TABLE community_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para psychological_tests
CREATE INDEX idx_psychological_tests_category ON psychological_tests(category);
CREATE INDEX idx_psychological_tests_difficulty ON psychological_tests(difficulty);
CREATE INDEX idx_psychological_tests_active ON psychological_tests(is_active);
CREATE INDEX idx_psychological_tests_created_by ON psychological_tests(created_by);

-- Índices para user_test_results
CREATE INDEX idx_user_test_results_user_id ON user_test_results(user_id);
CREATE INDEX idx_user_test_results_test_id ON user_test_results(test_id);
CREATE INDEX idx_user_test_results_completed_at ON user_test_results(completed_at);
CREATE INDEX idx_user_test_results_score ON user_test_results(score);

-- Índices para community_notes
CREATE INDEX idx_community_notes_user_id ON community_notes(user_id);
CREATE INDEX idx_community_notes_category ON community_notes(category);
CREATE INDEX idx_community_notes_public ON community_notes(is_public);
CREATE INDEX idx_community_notes_featured ON community_notes(is_featured);
CREATE INDEX idx_community_notes_created_at ON community_notes(created_at);

-- Indexes for performance
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON mood_entries(created_at);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_wellness_content_category ON wellness_content(category);
CREATE INDEX idx_user_progress_user_id_date ON user_progress(user_id, date);

-- Vector similarity search index
CREATE INDEX ON wellness_content USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychological_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notes ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be customized based on authentication method)
-- For now, allowing all operations for development
CREATE POLICY "Allow all for development" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON mood_entries FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON user_progress FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON automation_logs FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON psychological_tests FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON user_test_results FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON community_notes FOR ALL USING (true);

-- Public read access for wellness content and emergency resources
CREATE POLICY "Public read access" ON wellness_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON emergency_resources FOR SELECT USING (true);

-- Create a demo user for development
INSERT INTO users (id, email, name) VALUES 
('demo-user', 'demo@serenia.app', 'Usuario Demo')
ON CONFLICT (email) DO NOTHING;