# Configuración de Google OAuth para SerenIA

## Paso 1: Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la "Google+ API" o "Google Identity"

## Paso 2: Configurar OAuth Consent Screen

1. Ve a "APIs & Services" > "OAuth consent screen"
2. Selecciona "External" (para usuarios fuera de tu organización)
3. Completa la información:
   - **App name**: SerenIA - Asistente Emocional Cristiano
   - **User support email**: tu-email@gmail.com
   - **Developer contact email**: tu-email@gmail.com
   - **App domain**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app
   - **Privacy Policy URL**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/privacy
   - **Terms of Service URL**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/terms

## Paso 3: Crear credenciales OAuth

1. Ve a "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Selecciona "Web application"
4. Configura:
   - **Name**: SerenIA Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (desarrollo)
     - `https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/api/auth/callback/google` (producción)

## Paso 4: Configurar variables de entorno

### Desarrollo local (.env.local):
```
GOOGLE_CLIENT_ID=tu-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
```

### Producción (Vercel Environment Variables):
```
GOOGLE_CLIENT_ID=tu-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
NEXTAUTH_URL=https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app
NEXTAUTH_SECRET=tu-secret-muy-seguro-para-produccion
```

## URLs importantes para tu configuración:

**Desarrollo:**
- Origin: `http://localhost:3000`
- Callback: `http://localhost:3000/api/auth/callback/google`

**Producción:**
- Origin: `https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app`
- Callback: `https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/api/auth/callback/google`

## Notas importantes:

1. **Test Users**: En development mode de Google OAuth, solo usuarios específicos pueden hacer login. Para permitir cualquier usuario, necesitas publicar tu app.

2. **Scopes necesarios**: NextAuth automáticamente solicita:
   - `openid`
   - `email` 
   - `profile`

3. **Verificación**: Google puede requerir verificación si tu app solicita scopes sensibles.

## Problemas comunes:

- **Error 400 (redirect_uri_mismatch)**: Verifica que los URLs de redirect estén exactamente iguales en Google Console
- **Error 403 (access_blocked)**: Agrega usuarios de prueba en OAuth consent screen
- **Error during sign in**: Verifica que las variables de entorno estén configuradas correctamente