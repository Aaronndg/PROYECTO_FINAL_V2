-- Migración para añadir soporte completo de NextAuth.js
-- Ejecutar después del schema.sql principal

-- Agregar campos necesarios para NextAuth a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS image VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'credentials',
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- Tabla de sesiones de NextAuth
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  access_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cuentas de NextAuth (para OAuth)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_account_id)
);

-- Tabla de tokens de verificación
CREATE TABLE IF NOT EXISTS verification_tokens (
  token VARCHAR(255) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de favoritos de usuario
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES wellness_content(id) ON DELETE CASCADE,
  favorite_type VARCHAR(50) DEFAULT 'verse',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id)
);

-- Tabla de métricas de usuario para versículos
CREATE TABLE IF NOT EXISTS user_verse_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES wellness_content(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'view', 'share', 'copy', 'daily_read'
  action_count INTEGER DEFAULT 1,
  last_action_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, content_id, action_type)
);

-- Índices adicionales para NextAuth y favoritos
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_content_id ON user_favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_user_verse_metrics_user_id ON user_verse_metrics(user_id);

-- Actualizar políticas RLS para las nuevas tablas
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verse_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para desarrollo (permitir todo por ahora)
CREATE POLICY IF NOT EXISTS "Allow all for development" ON sessions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all for development" ON accounts FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all for development" ON verification_tokens FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all for development" ON user_favorites FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all for development" ON user_verse_metrics FOR ALL USING (true);

-- Función para crear un usuario con autenticación
CREATE OR REPLACE FUNCTION create_user_with_auth(
  p_email VARCHAR(255),
  p_name VARCHAR(255) DEFAULT NULL,
  p_password_hash VARCHAR(255) DEFAULT NULL,
  p_provider VARCHAR(50) DEFAULT 'credentials',
  p_provider_id VARCHAR(255) DEFAULT NULL,
  p_image VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO users (email, name, password_hash, provider, provider_id, image)
  VALUES (p_email, p_name, p_password_hash, p_provider, p_provider_id, p_image)
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, users.name),
    image = COALESCE(EXCLUDED.image, users.image),
    updated_at = NOW()
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de humor por usuario autenticado
CREATE OR REPLACE FUNCTION get_user_mood_stats(user_uuid UUID)
RETURNS TABLE (
  average_mood DECIMAL,
  total_entries INTEGER,
  mood_trend DECIMAL,
  recent_moods JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(mood_score), 2) as average_mood,
    COUNT(*)::INTEGER as total_entries,
    CASE 
      WHEN COUNT(*) < 2 THEN 0
      ELSE ROUND(
        (AVG(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN mood_score END) - 
         AVG(CASE WHEN created_at < NOW() - INTERVAL '7 days' AND created_at >= NOW() - INTERVAL '14 days' THEN mood_score END)), 2
      )
    END as mood_trend,
    json_agg(
      json_build_object(
        'date', date_trunc('day', created_at),
        'mood', mood_score,
        'description', mood_description
      ) ORDER BY created_at DESC
    ) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_moods
  FROM mood_entries 
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar interacciones con versículos
CREATE OR REPLACE FUNCTION record_verse_interaction(
  p_user_id UUID,
  p_content_id UUID,
  p_action_type VARCHAR(50)
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_verse_metrics (user_id, content_id, action_type, action_count, last_action_at)
  VALUES (p_user_id, p_content_id, p_action_type, 1, NOW())
  ON CONFLICT (user_id, content_id, action_type) 
  DO UPDATE SET
    action_count = user_verse_metrics.action_count + 1,
    last_action_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();