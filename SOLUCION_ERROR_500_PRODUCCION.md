# 🔧 Solución al Error 500 en Producción (Vercel)

## 🐛 Problema Identificado

**Error:** `POST https://rv-gestion-automotora20.vercel.app/api/auth/login 500 (Internal Server Error)`

**Causa:** El archivo `api/index.js` estaba intentando cargar las rutas desde `../backend/routes/`, pero en el deploy de Vercel **solo se despliegan las carpetas `api` y `frontend`**, no la carpeta `backend`.

Esto causaba que la función serverless crasheara al intentar hacer `require('../backend/routes/auth.routes')` porque esa ruta no existía en el entorno de Vercel.

---

## ✅ Solución Aplicada

### 1. Copiar Rutas y Middleware a la Carpeta `api`

```bash
# Copiadas las carpetas necesarias
backend/routes/ → api/routes/
backend/middleware/ → api/middleware/
```

### 2. Actualizar Referencias en `api/index.js`

**ANTES:**
```javascript
const authRoutes = require('../backend/routes/auth.routes');
const autosRoutes = require('../backend/routes/autos.routes');
// ...
```

**DESPUÉS:**
```javascript
const authRoutes = require('./routes/auth.routes');
const autosRoutes = require('./routes/autos.routes');
// ...
```

### 3. Actualizar Imports en Todas las Rutas

**ANTES (en cada archivo de ruta):**
```javascript
const prisma = require('../../api/lib/prisma');
const { authMiddleware } = require('../middleware/auth.middleware');
```

**DESPUÉS:**
```javascript
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth.middleware');
```

---

## 📋 Archivos Modificados

1. ✅ `api/index.js` - Actualizado require de rutas
2. ✅ `api/routes/auth.routes.js` - Actualizado require de prisma
3. ✅ `api/routes/autos.routes.js` - Actualizado require de prisma
4. ✅ `api/routes/clientes.routes.js` - Actualizado require de prisma
5. ✅ `api/routes/pagos.routes.js` - Actualizado require de prisma
6. ✅ `api/routes/dashboard.routes.js` - Actualizado require de prisma
7. ✅ `api/middleware/auth.middleware.js` - Copiado desde backend

---

## 🚀 Deploy Actualizado

Los cambios ya fueron subidos a GitHub:
- Commit: `🔧 Fix: Copiar routes y middleware a carpeta api para Vercel`
- Branch: `main`

**Vercel detectará automáticamente el push y hará un nuevo deploy.**

---

## ⏱️ Próximos Pasos

### 1. Esperar el Auto-Deploy (2-3 minutos)

Ve a: https://vercel.com/dashboard
- Selecciona tu proyecto
- Ve a "Deployments"
- Espera a que el último deployment esté en estado "Ready"

### 2. Verificar que la API Funcione

Una vez que el deploy termine, prueba estos endpoints:

**Health Check:**
```
https://rv-gestion-automotora20.vercel.app/api/health
```
✅ Debe responder: `"status": "OK"`, `"database": "connected"`

**Diagnostic:**
```
https://rv-gestion-automotora20.vercel.app/api/diagnostic
```
✅ Todas las variables deben tener ✅

### 3. Probar el Login

Abre tu aplicación:
```
https://rv-gestion-automotora20.vercel.app
```

Intenta iniciar sesión con:
- **Email:** `admin@rvautomoviles.com`
- **Contraseña:** `Admin123!`

---

## 🔍 Si Todavía Hay Error

### Verificar Variables de Entorno en Vercel

Ve a: https://vercel.com/dashboard
→ Tu proyecto → Settings → Environment Variables

**Asegúrate de que estén configuradas estas 6 variables:**

1. `NODE_ENV` = `production`
2. `JWT_SECRET` = (tu secreto)
3. `POSTGRES_PRISMA_URL` = (tu URL de Neon)
4. `POSTGRES_URL_NON_POOLING` = (tu URL de Neon)
5. `VITE_API_URL` = `/api`
6. `FRONTEND_URL` = `https://rv-gestion-automotora20.vercel.app`

### Ver Logs en Tiempo Real

```bash
vercel logs https://rv-gestion-automotora20.vercel.app --follow
```

O en el dashboard:
- Deployments → Click en el último → "View Function Logs"

---

## 📌 Notas Importantes

- ✅ Las carpetas `routes` y `middleware` ahora existen tanto en `backend/` como en `api/`
- ✅ El backend local (desarrollo) sigue usando `backend/routes/`
- ✅ Vercel (producción) ahora usa `api/routes/`
- ✅ No hay conflictos porque cada entorno usa su propia carpeta

---

## 🎯 Estado Actual

- ✅ Código actualizado
- ✅ Commit realizado
- ✅ Push a GitHub exitoso
- ⏱️ Esperando auto-deploy en Vercel (2-3 minutos)

**Una vez que termine el deploy, tu aplicación debería funcionar correctamente en producción.** 🚀
