-- Tabla para usuarios de Telegram
CREATE TABLE IF NOT EXISTS telegram_users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  telegram_chat_id VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  username VARCHAR(100),
  language_code VARCHAR(10) DEFAULT 'es',
  
  -- Configuración de notificaciones
  morning_time TIME DEFAULT '08:00',
  afternoon_time TIME DEFAULT '14:00',
  evening_time TIME DEFAULT '20:00',
  timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
  notifications_enabled BOOLEAN DEFAULT true,
  
  -- Tipos de notificaciones permitidas
  check_in_notifications BOOLEAN DEFAULT true,
  verse_notifications BOOLEAN DEFAULT true,
  activity_notifications BOOLEAN DEFAULT true,
  crisis_notifications BOOLEAN DEFAULT true,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el historial de notificaciones enviadas
CREATE TABLE IF NOT EXISTS telegram_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES telegram_users(user_id),
  notification_type VARCHAR(50) NOT NULL,
  message_content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  
  -- Metadata del mensaje
  message_id INTEGER,
  chat_id VARCHAR(50),
  
  FOREIGN KEY (user_id) REFERENCES telegram_users(user_id) ON DELETE CASCADE
);

-- Tabla para actividades completadas vía Telegram
CREATE TABLE IF NOT EXISTS telegram_activities (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES telegram_users(user_id),
  activity_type VARCHAR(50) NOT NULL,
  activity_id VARCHAR(100),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  feedback TEXT,
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  
  FOREIGN KEY (user_id) REFERENCES telegram_users(user_id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_telegram_users_chat_id ON telegram_users(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_notifications ON telegram_users(notifications_enabled, morning_time, afternoon_time, evening_time);
CREATE INDEX IF NOT EXISTS idx_telegram_notifications_user_type ON telegram_notifications(user_id, notification_type);
CREATE INDEX IF NOT EXISTS idx_telegram_notifications_sent_at ON telegram_notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_telegram_activities_user_id ON telegram_activities(user_id, completed_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_telegram_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_telegram_users_updated_at ON telegram_users;
CREATE TRIGGER trigger_update_telegram_users_updated_at
  BEFORE UPDATE ON telegram_users
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_users_updated_at();

-- Función para registrar interacciones de usuario
CREATE OR REPLACE FUNCTION update_telegram_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE telegram_users 
  SET last_interaction = NOW() 
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar última interacción
DROP TRIGGER IF EXISTS trigger_update_telegram_last_interaction ON telegram_notifications;
CREATE TRIGGER trigger_update_telegram_last_interaction
  AFTER INSERT ON telegram_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_last_interaction();

DROP TRIGGER IF EXISTS trigger_update_telegram_last_interaction_activities ON telegram_activities;
CREATE TRIGGER trigger_update_telegram_last_interaction_activities
  AFTER INSERT ON telegram_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_last_interaction();

-- Función para obtener usuarios que necesitan notificaciones
CREATE OR REPLACE FUNCTION get_users_for_notification(notification_hour TIME)
RETURNS TABLE(
  user_id VARCHAR(50),
  telegram_chat_id VARCHAR(50),
  first_name VARCHAR(100),
  notification_type VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tu.user_id,
    tu.telegram_chat_id,
    tu.first_name,
    CASE 
      WHEN tu.morning_time = notification_hour THEN 'morning'
      WHEN tu.afternoon_time = notification_hour THEN 'afternoon'
      WHEN tu.evening_time = notification_hour THEN 'evening'
      ELSE 'unknown'
    END as notification_type
  FROM telegram_users tu
  WHERE tu.notifications_enabled = true
  AND (
    tu.morning_time = notification_hour OR
    tu.afternoon_time = notification_hour OR
    tu.evening_time = notification_hour
  )
  AND tu.last_interaction >= NOW() - INTERVAL '7 days'; -- Solo usuarios activos
END;
$$ LANGUAGE plpgsql;