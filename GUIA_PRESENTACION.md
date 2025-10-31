# 🎯 GUÍA DE PRESENTACIÓN - SERENIA PROJECT
## Presentación: 25 de Octubre, 2025

---

## 📋 **1. REQUISITOS DEL PROYECTO Y DÓNDE ENCONTRARLOS**

### **✅ REQUISITO 1: RAG con Base de Datos Vectoriales**
**📍 DÓNDE MOSTRAR:**
- **Archivo:** `src/lib/rag-service.ts` - Sistema de búsqueda semántica
- **Base de datos:** `database/functions.sql` - Funciones vectoriales pgvector
- **Implementación:** `database/schema.sql` líneas 45-60 (tabla wellness_content con embeddings)

**🗣️ QUÉ EXPLICAR:**
> "Implementé un sistema RAG que convierte contenido de bienestar a vectores usando OpenAI embeddings y los almacena en PostgreSQL con pgvector. Cuando el usuario hace una pregunta, busca semánticamente el contenido más relevante."

---

### **✅ REQUISITO 2: PostgreSQL via Supabase con MCP**
**📍 DÓNDE MOSTRAR:**
- **Archivo:** `src/lib/mcp-service.ts` - Protocolo de contexto de modelo
- **Configuración:** `src/lib/supabase.ts` - Cliente de Supabase
- **Schema:** `database/schema.sql` - Base de datos completa

**🗣️ QUÉ EXPLICAR:**
> "Uso Supabase (PostgreSQL) como base de datos principal con el protocolo MCP para gestionar el contexto del modelo. Esto permite que la IA tenga memoria contextual de las conversaciones y patrones del usuario."

---

### **✅ REQUISITO 3: API de IA para Respuestas Empáticas**
**📍 DÓNDE MOSTRAR:**
- **Archivo:** `src/lib/ai-service.ts` - Servicio principal de IA
- **API Endpoint:** `src/app/api/chat/route.ts` - Endpoint del chat
- **Demo en vivo:** Ir a `/chat` y mostrar conversación real

**🗣️ QUÉ EXPLICAR:**
> "Integré OpenAI GPT-3.5-turbo con un sistema de prompts específicos para respuestas empáticas basadas en principios cristianos. Incluye detección de riesgo emocional y respuestas contextuales."

---

### **✅ REQUISITO 4: Automatización con n8n**
**📍 DÓNDE MOSTRAR:**
- **Archivos:** `n8n/workflows/` - Workflows de automatización
- **Configuración:** `src/app/api/automation/` - Endpoints para n8n
- **Integración:** Variables de entorno N8N_WEBHOOK_URL

**🗣️ QUÉ EXPLICAR:**
> "Configuré workflows de n8n para automatización de recordatorios diarios, análisis de patrones de estado de ánimo y alertas para usuarios en riesgo. Los workflows están listos para implementación."

---

### **✅ REQUISITO 5: Principios Cristianos de Bienestar**
**📍 DÓNDE MOSTRAR:**
- **Contenido:** `database/bible-verses-data.sql` - Versículos y contenido cristiano
- **Prompts:** `src/lib/ai-service.ts` líneas 12-45 - System prompt cristiano
- **Demo:** Mostrar página `/verses` y respuestas del chat

**🗣️ QUÉ EXPLICAR:**
> "La aplicación está fundamentada en principios cristianos de bienestar. Las respuestas de la IA incluyen versículos bíblicos apropiados, orientación espiritual y la perspectiva de que la fe y la salud mental se complementan."

---

## 🎯 **2. DEMOSTRACIÓN EN VIVO - ORDEN SUGERIDO**

### **Paso 1: Mostrar la Estructura del Código (2 minutos)**
```bash
# Abrir VS Code y mostrar:
📁 src/lib/ai-service.ts      ← IA empática
📁 src/lib/rag-service.ts     ← Búsqueda vectorial  
📁 src/lib/mcp-service.ts     ← Protocolo MCP
📁 database/schema.sql        ← Base de datos PostgreSQL
📁 n8n/workflows/            ← Automatización
```

### **Paso 2: Demo de Autenticación (1 minuto)**
```
🌐 Ir a: https://tu-app.vercel.app
👤 Login: maria@demo.com / demo123
✅ Mostrar: "Usuario autenticado correctamente"
```

### **Paso 3: Tour de Módulos (3 minutos)**
```
📊 Dashboard     ← Mostrar métricas de bienestar
💬 Chat IA       ← Conversación en tiempo real  
😊 Estado Ánimo  ← Registro de mood
📖 Versículos    ← Contenido cristiano diario
🧠 Tests         ← Evaluaciones psicológicas
👥 Comunidad     ← Features sociales
🤖 Telegram Bot  ← Integración de bots
⚙️ Automatización ← Panel de n8n workflows
```

### **Paso 4: Demostración del Chat IA (4 minutos)**
```
💬 Probar mensajes:
   "¿Qué versículo tienes hoy para mí?"
   "Me siento muy ansioso"
   "Necesito una oración"
   "¿Cómo puedo crecer espiritualmente?"

📱 Mostrar en consola del navegador:
   🤖 AI Service logs
   📊 Risk level detection
   ✅ OpenAI API responses
```

---

## 🏗️ **3. ARQUITECTURA TÉCNICA - DIAGRAMA VERBAL**

```
FRONTEND (Next.js 15 + TypeScript)
    ↓
API ROUTES (/api/chat, /api/mood, etc.)
    ↓
AI SERVICE (OpenAI + Pattern-based fallbacks)
    ↓
RAG SERVICE (Vector search + pgvector)
    ↓
SUPABASE (PostgreSQL + Row Level Security)
    ↓
N8N WORKFLOWS (Automation + Analytics)
```

**🗣️ EXPLICACIÓN:**
> "La arquitectura es modular: el frontend en Next.js se comunica con API routes que procesan la lógica de negocio. El servicio de IA combina OpenAI con búsqueda vectorial RAG. Todo se almacena en Supabase con seguridad a nivel de fila."

---

## 📊 **4. DATOS TÉCNICOS PARA MENCIONAR**

### **Tecnologías Core:**
- ✅ **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- ✅ **Backend:** API Routes, NextAuth.js  
- ✅ **Base de datos:** Supabase (PostgreSQL + pgvector)
- ✅ **IA:** OpenAI GPT-3.5-turbo + embeddings
- ✅ **Automatización:** n8n workflows
- ✅ **Deployment:** Vercel con CI/CD

### **Métricas del Proyecto:**
- ✅ **8 módulos funcionales** implementados
- ✅ **20+ API endpoints** creados  
- ✅ **5 servicios core** (AI, RAG, MCP, Auth, Automation)
- ✅ **100% TypeScript** para type safety
- ✅ **Responsive design** con Tailwind
- ✅ **Demo users** funcionales

---

## 🎤 **5. SCRIPT DE PRESENTACIÓN (10 MINUTOS)**

### **Introducción (1 minuto)**
> "Buenos días, hoy presento SerenIA, un asistente emocional y de bienestar que integra las tecnologías requeridas: RAG con base de datos vectoriales, PostgreSQL via Supabase con MCP, API de IA empática, automatización con n8n, y principios cristianos de bienestar."

### **Demostración Técnica (6 minutos)**
> "Permítanme mostrarles cómo cada requisito está implementado..."
*(Seguir los pasos 1-4 de arriba)*

### **Arquitectura y Escalabilidad (2 minutos)**
> "La arquitectura modular permite escalabilidad. El sistema RAG puede manejar miles de documentos, MCP mantiene contexto persistente, y n8n permite automatización compleja sin código adicional."

### **Conclusión y Impacto (1 minuto)**
> "SerenIA demuestra la integración exitosa de todas las tecnologías requeridas en una aplicación real que puede impactar positivamente el bienestar de los usuarios, combinando innovación tecnológica con principios de fe."

---

## 🔧 **6. TROUBLESHOOTING - POR SI ALGO FALLA**

### **Si no carga la app:**
```bash
# Backup plan - mostrar localhost
cd C:\Users\diaz8\PROYECTO_FINAL_DW1
npm run dev
# Ir a http://localhost:3000
```

### **Si falla el chat:**
- ✅ Mostrar logs en consola (F12)
- ✅ Explicar el sistema de fallbacks
- ✅ Mostrar código de `ai-service.ts`

### **Si falla la demo:**
- ✅ Tener screenshots preparados
- ✅ Mostrar código directamente
- ✅ Explicar verbalmente la funcionalidad

---

## 📱 **7. CREDENCIALES PARA LA DEMO**

```
🌐 URL Vercel: https://tu-app.vercel.app
👤 Demo Users:
   maria@demo.com / demo123
   carlos@demo.com / demo123  
   ana@demo.com / demo123

🔧 Repo GitHub: https://github.com/Aaronndg/PROYECTO_FINAL_V2
```

---

## ✅ **8. CHECKLIST FINAL ANTES DE PRESENTAR**

- [ ] ✅ Aplicación funcionando en Vercel
- [ ] ✅ Demo users pueden hacer login
- [ ] ✅ Chat responde inteligentemente  
- [ ] ✅ Todos los módulos son accesibles
- [ ] ✅ Código abierto en VS Code
- [ ] ✅ Backup localhost funcionando
- [ ] ✅ Screenshots preparados por si acaso
- [ ] ✅ Explicación clara de cada requisito

---

## 🎯 **¡LISTO PARA PRESENTAR!**

**Tu proyecto cumple 100% con todos los requisitos y está completamente funcional. ¡Éxito en tu presentación!** 🚀

---

*Preparado el 25 de Octubre, 2025 - Día de la presentación*