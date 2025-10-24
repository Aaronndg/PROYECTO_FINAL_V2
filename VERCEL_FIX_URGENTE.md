# 🚀 Configuración Urgente de Vercel para SerenIA

## ⚠️ PROBLEMA ACTUAL
- ✅ Local funciona (usuarios demo funcionando)
- ❌ Vercel falla (faltan variables de entorno)

## 🔧 SOLUCIÓN INMEDIATA

### Paso 1: Ir a Vercel Dashboard
1. Ve a: https://vercel.com/dashboard
2. Busca tu proyecto: `proyecto-final-v2` o similar
3. Click en el proyecto
4. Ve a **Settings** > **Environment Variables**

### Paso 2: Agregar Variables Críticas
Agrega estas variables **UNA POR UNA**:

#### Variable 1: NEXTAUTH_SECRET
- **Name**: `NEXTAUTH_SECRET`
- **Value**: `fe610e38155a8d3dc1f6656bd9d8e35f57a1aa525de6ff51d63961fccde405a2`
- **Environments**: ✓ Production ✓ Preview ✓ Development

#### Variable 2: NEXTAUTH_URL
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app`
- **Environments**: ✓ Production ✓ Preview ✓ Development

### Paso 3: Redeploy
1. Después de agregar las variables, ve a **Deployments**
2. Click en los 3 puntos (...) del deployment más reciente
3. Click **Redeploy**
4. Espera 2-3 minutos

## 🧪 DESPUÉS DE CONFIGURAR - PROBAR:

### URL de Prueba:
```
https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/auth/signin
```

### Credenciales de Prueba:
- **Email**: `maria@demo.com`
- **Password**: `demo123`

## 🔍 SI SIGUE FALLANDO:

### 1. Verificar logs en Vercel:
- Ve a **Functions** > Click en cualquier function
- Ve a **Logs** para ver errores

### 2. URLs importantes:
- **Demo**: `https://tu-app.vercel.app/demo` (debería funcionar)
- **Credenciales**: `https://tu-app.vercel.app/credentials` (debería funcionar)
- **Login**: `https://tu-app.vercel.app/auth/signin` (después del fix)

## ⏰ TIEMPO ESTIMADO: 5 minutos

Sin estas variables, NextAuth no puede funcionar en producción, aunque funcione localmente.

---

**🎯 PRIORIDAD MÁXIMA**: Solo necesitas NEXTAUTH_SECRET y NEXTAUTH_URL para que funcione el login demo.