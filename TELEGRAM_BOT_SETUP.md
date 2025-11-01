# Guía Completa para Configurar el Bot de Telegram en Producción

## 1. Crear el Bot de Telegram

### Paso 1: Contactar a BotFather
1. Abre Telegram y busca `@BotFather`
2. Inicia una conversación con `/start`
3. Crea un nuevo bot con `/newbot`
4. Sigue las instrucciones:
   - Nombre del bot: `SerenIA Bot`
   - Username del bot: `serenia_bot` (debe terminar en 'bot')

### Paso 2: Obtener el Token
- BotFather te dará un token como: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
- **¡GUARDA ESTE TOKEN SEGURO!**

### Paso 3: Configurar el Bot
Envía estos comandos a BotFather:

```
/setdescription
SerenIA Bot - Tu asistente de bienestar emocional basado en principios cristianos. Encuentra paz, apoyo y crecimiento espiritual con inteligencia artificial empática.

/setabouttext
🌟 SerenIA Bot
Tu compañero de bienestar emocional y crecimiento espiritual. Ofrezco:
• Check-ins emocionales
• Versículos personalizados
• Actividades de bienestar
• Apoyo en crisis
• Principios cristianos de sanidad

Desarrollado con amor y tecnología para tu bienestar integral.

/setuserpic
(Aquí puedes subir una imagen del logo de SerenIA)

/setcommands
start - Iniciar SerenIA Bot
checkin - Check-in emocional rápido
verse - Versículo del día personalizado
activity - Actividad de bienestar
crisis - Ayuda inmediata en crisis
help - Ver todos los comandos
```

## 2. Configurar Variables de Entorno en Vercel

### En el Dashboard de Vercel:
1. Ve a tu proyecto: https://vercel.com/dashboard
2. Selecciona tu proyecto `proyecto-final-v2`
3. Ve a `Settings` > `Environment Variables`
4. Agrega estas variables:

```
TELEGRAM_BOT_TOKEN = [tu-token-del-bot]
TELEGRAM_WEBHOOK_URL = https://tu-dominio.vercel.app/api/telegram/webhook
```

### Variables completas recomendadas:
```
# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBHOOK_URL=https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/api/telegram/webhook

# Para notificaciones programadas (opcional)
TELEGRAM_ADMIN_CHAT_ID=tu-chat-id-de-admin

# Para logs y monitoreo (opcional)
TELEGRAM_LOG_CHAT_ID=tu-chat-id-para-logs
```

## 3. Configurar el Webhook

Una vez que tengas el token configurado, necesitas establecer el webhook:

### Opción A: Usar la API de Telegram directamente
```bash
curl -X POST "https://api.telegram.org/bot[TU-TOKEN]/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://tu-dominio.vercel.app/api/telegram/webhook"}'
```

### Opción B: Usar nuestro endpoint de configuración
Una vez desplegado, visita:
`https://tu-dominio.vercel.app/api/telegram/setup`

## 4. Ejecutar Scripts de Base de Datos

Si usas Supabase, ejecuta el script SQL:
```sql
-- Ejecutar el contenido de database/telegram-schema.sql
-- en tu consola de Supabase
```

## 5. Probar el Bot

### Tests básicos:
1. Busca tu bot en Telegram: `@serenia_bot`
2. Envía `/start`
3. Prueba todos los comandos:
   - `/checkin`
   - `/verse`
   - `/activity`
   - `/crisis`
   - `/help`

### Tests avanzados:
1. Envía mensajes de texto normales
2. Verifica que responda empáticamente
3. Prueba botones inline
4. Verifica detección de crisis con palabras como "tristeza", "ansiedad"

## 6. Monitoreo y Logs

### En Vercel:
1. Ve a tu proyecto > Functions
2. Revisa los logs de `/api/telegram/webhook`
3. Busca errores o warnings

### En Telegram:
1. Verifica que los comandos respondan rápidamente
2. Asegúrate de que los botones funcionen
3. Confirma que las notificaciones lleguen (si las configuras)

## 7. Troubleshooting Común

### Bot no responde:
- Verifica que el token esté correcto en Vercel
- Confirma que el webhook esté configurado
- Revisa los logs en Vercel Functions

### Error 400/401:
- Token incorrecto o expirado
- Reconfigura el bot con BotFather

### Error 404:
- URL del webhook incorrecta
- Verifica que la ruta `/api/telegram/webhook` exista

### Mensajes no llegan:
- Confirma que el usuario haya iniciado el bot con `/start`
- Verifica que el chat_id sea correcto

## 8. Configuración de Notificaciones Programadas (Opcional)

Para habilitar notificaciones automáticas:

### En Vercel:
1. Agrega la variable `TELEGRAM_CRON_SECRET=tu-secreto-seguro`
2. Crea una cuenta en cron-job.org
3. Programa estas URLs:
   - `https://tu-dominio.vercel.app/api/telegram/notifications/morning` (8:00 AM)
   - `https://tu-dominio.vercel.app/api/telegram/notifications/afternoon` (2:00 PM)
   - `https://tu-dominio.vercel.app/api/telegram/notifications/evening` (8:00 PM)

## 9. Seguridad

### Mejores prácticas:
- Nunca compartas tu token públicamente
- Usa HTTPS siempre
- Valida todos los mensajes entrantes
- Implementa rate limiting si es necesario
- Mantén logs para auditoría

### Variables sensibles:
```
# NO incluir en el código fuente
TELEGRAM_BOT_TOKEN=secret
TELEGRAM_WEBHOOK_SECRET=secret-para-validar-requests
```

## 10. Métricas y Analytics (Opcional)

### Tracking recomendado:
- Número de usuarios activos
- Comandos más usados
- Tiempo de respuesta
- Errores y excepciones
- Conversaciones por día

### Herramientas:
- Vercel Analytics
- Google Analytics (eventos)
- Telegram Analytics (built-in)

---

## ✅ Checklist Final

- [ ] Bot creado en BotFather
- [ ] Token obtenido y guardado seguro
- [ ] Variables configuradas en Vercel
- [ ] Webhook establecido
- [ ] Base de datos configurada (si aplica)
- [ ] Tests básicos completados
- [ ] Logs verificados
- [ ] Documentación actualizada
- [ ] Monitoreo configurado

Una vez completado este checklist, tu bot estará completamente funcional en producción.