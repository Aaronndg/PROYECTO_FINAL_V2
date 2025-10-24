# Variables de entorno para Vercel (Producción)
# Copia estas variables a tu panel de Vercel Environment Variables

# NextAuth Configuration
NEXTAUTH_SECRET=tu-secret-muy-seguro-aqui-minimo-32-caracteres
NEXTAUTH_URL=https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Supabase (opcional - para base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# OpenAI o DeepSeek API (para el chat IA)
OPENAI_API_KEY=tu-openai-api-key
# O si usas DeepSeek:
DEEPSEEK_API_KEY=tu-deepseek-api-key

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=tu-telegram-bot-token

# n8n Webhook (opcional)
N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook

## Instrucciones para configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Agrega cada variable una por una
4. Asegúrate de seleccionar "Production", "Preview" y "Development" según necesites
5. Redeploy tu aplicación después de agregar las variables

## Variables críticas para funcionamiento básico:
- NEXTAUTH_SECRET (obligatorio)
- NEXTAUTH_URL (obligatorio)
- GOOGLE_CLIENT_ID (para OAuth)
- GOOGLE_CLIENT_SECRET (para OAuth)

## Variables opcionales:
- NEXT_PUBLIC_SUPABASE_URL (para persistencia de datos)
- SUPABASE_SERVICE_ROLE_KEY (para operaciones de backend)
- OPENAI_API_KEY (para funcionalidad de chat IA)
- TELEGRAM_BOT_TOKEN (para bot de Telegram)
- N8N_WEBHOOK_URL (para automatizaciones)

Sin las variables críticas, la aplicación funcionará en modo demo limitado.