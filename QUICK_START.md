# ⚡ Quick Start - Deploy RV Automóviles

## 🎯 Resumen Ejecutivo

Tu aplicación **YA ESTÁ LISTA** para hacer deploy en Vercel + Neon. Solo necesitas seguir estos pasos:

---

## ✅ Lo que YA está hecho

✅ Schema Prisma migrado a PostgreSQL
✅ Variables de entorno configuradas (.env.example)
✅ vercel.json creado con configuración monorepo
✅ Backend preparado para serverless (api/index.js)
✅ Frontend configurado con variables de entorno dinámicas
✅ Documentación completa en DEPLOYMENT.md
✅ Todo commiteado y pusheado a GitHub

---

## 🚀 Próximos 3 pasos (15 minutos)

### Paso 1: Crear base de datos en Neon (3 min)

1. Ve a [https://neon.tech](https://neon.tech)
2. Crea cuenta gratuita
3. Click en **"Create a project"**
4. Nombre: `rv-automoviles-db`
5. Región: US East (Ohio)
6. **COPIA EL CONNECTION STRING** (ejemplo):
   ```
   postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Paso 2: Importar proyecto en Vercel (5 min)

1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Selecciona: `Gestio_RV_Automoviles`
4. Click **"Import"**

**Configuración del proyecto:**

- **Framework Preset**: Other
- **Root Directory**: (dejar en blanco)
- **Build Command**: 
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Output Directory**: 
  ```bash
  frontend/dist
  ```
- **Install Command**: 
  ```bash
  cd backend && npm install && npm run build && cd ../frontend && npm install
  ```

### Paso 3: Configurar Variables de Entorno (5 min)

En la página de configuración de Vercel, click en **"Environment Variables"** y agrega:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu connection string de Neon (Paso 1) |
| `JWT_SECRET` | Genera con: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://tu-dominio.vercel.app` (lo tendrás después del deploy) |
| `VITE_API_URL` | `https://tu-dominio.vercel.app/api` |
| `NODE_ENV` | `production` |

**Click en "Deploy"** y espera 2-3 minutos ⏳

---

## 🔧 Post-Deploy (2 min)

Una vez que Vercel termine el deploy:

1. Copia tu URL: `https://tu-dominio-xyz.vercel.app`
2. Ve a **Settings → Environment Variables**
3. **Actualiza**:
   - `FRONTEND_URL` → `https://tu-dominio-xyz.vercel.app`
   - `VITE_API_URL` → `https://tu-dominio-xyz.vercel.app/api`
4. Click en **Deployments → Redeploy**

---

## ✨ Verificación Final

1. Abre: `https://tu-dominio-xyz.vercel.app`
2. Deberías ver la página de login de RV Automóviles
3. Prueba: `https://tu-dominio-xyz.vercel.app/api/health`
4. Deberías ver: `{"status":"OK",...}`

---

## 🎉 ¡Listo!

Tu aplicación ya está en producción. Ahora necesitas:

1. **Crear usuario admin** (POST a `/api/auth/register` o SQL en Neon)
2. **Login con**: `admin@rv.com` / `admin123`

---

## 📚 Documentación Completa

Para más detalles, troubleshooting y configuración avanzada:

👉 **Lee [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🆘 Problemas Comunes

### "Cannot find module @prisma/client"
→ Agrega variable: `PRISMA_GENERATE_DATAPROXY=true` en Vercel

### "Database connection failed"
→ Verifica que DATABASE_URL incluya `?sslmode=require` al final

### "CORS blocked"
→ Verifica que FRONTEND_URL coincida exactamente con tu dominio

### Error 500 en API
→ Ve a Vercel → Logs → Functions para ver el error específico

---

## 🎯 Comandos Útiles

```bash
# Ver logs de Vercel CLI
vercel logs

# Ver estado de deployment
vercel ls

# Redeployar manualmente
vercel --prod

# Ver variables de entorno
vercel env ls
```

---

**¿Listo para el deploy? ¡Adelante! 🚀**

Cualquier problema, revisa [DEPLOYMENT.md](./DEPLOYMENT.md) o abre un issue en GitHub.
