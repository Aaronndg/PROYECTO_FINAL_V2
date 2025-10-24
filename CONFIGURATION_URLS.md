# URLs de configuración para SerenIA

## Producción (Vercel)
- **App URL**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app
- **Auth Callback**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/api/auth/callback/google
- **Signin Page**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/auth/signin
- **Demo Page**: https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/demo

## Desarrollo Local
- **App URL**: http://localhost:3000
- **Auth Callback**: http://localhost:3000/api/auth/callback/google
- **Signin Page**: http://localhost:3000/auth/signin
- **Demo Page**: http://localhost:3000/demo

## Para configurar en Google Cloud Console:

### Authorized JavaScript Origins:
```
http://localhost:3000
https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app
```

### Authorized Redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://proyecto-final-v2-git-master-aaronndgs-projects.vercel.app/api/auth/callback/google
```

## Enlaces directos para configuración:

- **Google Cloud Console**: https://console.cloud.google.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com/

## Comandos útiles para desarrollo:

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Hacer deploy a Vercel
git push origin master

# Ver logs de Vercel
vercel logs

# Ver variables de entorno
vercel env ls
```