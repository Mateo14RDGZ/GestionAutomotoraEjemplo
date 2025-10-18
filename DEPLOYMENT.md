# 🚀 Guía de Deployment - RV Automóviles en Vercel + Neon

Esta guía te llevará paso a paso para hacer el deploy completo de la aplicación RV Automóviles en Vercel con base de datos PostgreSQL en Neon.

---

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [Neon](https://neon.tech) (gratis)
- Repositorio en GitHub con el código del proyecto
- Node.js 18+ instalado localmente

---

## 🗄️ Paso 1: Configurar Base de Datos en Neon

### 1.1 Crear cuenta y proyecto en Neon

1. Ve a [https://neon.tech](https://neon.tech) y crea una cuenta gratuita
2. Haz clic en **"Create a project"**
3. Configura tu proyecto:
   - **Project name**: `rv-automoviles-db`
   - **Region**: Elige la región más cercana (ej: US East - Ohio)
   - **Postgres version**: 16 (recomendado)
4. Haz clic en **"Create project"**

### 1.2 Obtener Connection String

1. Una vez creado el proyecto, verás un **Connection String**
2. Copia el connection string completo (debe verse así):
   ```
   postgresql://usuario:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **¡GUÁRDALO EN UN LUGAR SEGURO!** Lo necesitarás más adelante

### 1.3 Configurar la base de datos (opcional - ejecutar migraciones localmente)

Si quieres probar la base de datos localmente antes del deploy:

```bash
# En la carpeta backend
cd backend

# Crea un archivo .env y pega tu connection string
echo "DATABASE_URL=postgresql://tu-connection-string-aqui" > .env
echo "JWT_SECRET=tu_secreto_super_seguro_cambiar" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# Genera el cliente de Prisma
npm run prisma:generate

# Aplica las migraciones
npm run prisma:push

# (Opcional) Ejecuta el seed para datos de prueba
npm run prisma:seed
```

---

## 🚀 Paso 2: Preparar el Repositorio en GitHub

### 2.1 Verificar que tienes los archivos necesarios

Asegúrate de que tu repositorio tenga estos archivos (ya los he creado):

```
✅ vercel.json (configuración de Vercel)
✅ backend/api/index.js (entry point serverless)
✅ backend/.env.example (template de variables)
✅ frontend/.env.example (template de variables)
✅ backend/prisma/schema.prisma (migraciones PostgreSQL)
✅ DEPLOYMENT.md (esta guía)
```

### 2.2 Commit y push de los cambios

```bash
# En la raíz del proyecto
git add .
git commit -m "feat: Configuración para deployment en Vercel con Neon PostgreSQL"
git push origin main
```

---

## ☁️ Paso 3: Deploy en Vercel

### 3.1 Importar proyecto desde GitHub

1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Haz clic en **"Import Git Repository"**
3. Selecciona tu repositorio `Gestio_RV_Automoviles`
4. Haz clic en **"Import"**

### 3.2 Configurar el proyecto

En la página de configuración:

#### Framework Preset
- Selecciona: **"Other"** (porque es un monorepo)

#### Root Directory
- Deja en blanco (monorepo)

#### Build Command
```bash
cd frontend && npm install && npm run build
```

#### Output Directory
```bash
frontend/dist
```

#### Install Command
```bash
cd backend && npm install && npm run build && cd ../frontend && npm install
```

### 3.3 Configurar Variables de Entorno

**¡MUY IMPORTANTE!** Haz clic en **"Environment Variables"** y agrega las siguientes:

#### Variables del Backend:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Tu connection string de Neon (Paso 1.2) |
| `JWT_SECRET` | `tu_secreto_super_seguro_largo_y_aleatorio` | Genera uno seguro con: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://tu-dominio.vercel.app` | Lo obtendrás después del deploy (déjalo vacío por ahora) |
| `NODE_ENV` | `production` | |

#### Variables del Frontend:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | `https://tu-dominio.vercel.app/api` | Lo actualizarás después del primer deploy |

### 3.4 Hacer el primer deploy

1. Haz clic en **"Deploy"**
2. Espera de 2-5 minutos mientras Vercel construye tu aplicación
3. Una vez terminado, verás un mensaje de éxito con tu URL de producción

---

## 🔧 Paso 4: Configuración Post-Deploy

### 4.1 Actualizar FRONTEND_URL y VITE_API_URL

1. Copia tu URL de producción (ej: `https://rv-automoviles-abc123.vercel.app`)
2. Ve a **"Settings" → "Environment Variables"** en Vercel
3. **Edita** las siguientes variables:
   - `FRONTEND_URL` → `https://tu-dominio.vercel.app`
   - `VITE_API_URL` → `https://tu-dominio.vercel.app/api`
4. Haz clic en **"Save"**
5. Ve a **"Deployments"** y haz clic en **"Redeploy"** → **"Redeploy"**

### 4.2 Ejecutar migraciones de base de datos

Las migraciones se ejecutan automáticamente durante el build gracias al script `vercel-build` en `backend/package.json`:

```json
"vercel-build": "npx prisma generate && npx prisma db push --accept-data-loss"
```

Si necesitas ejecutar el seed manualmente:

1. Abre tu proyecto en Neon Console
2. Haz clic en **"SQL Editor"**
3. Ejecuta las queries del archivo `backend/prisma/seed.js` manualmente

### 4.3 Crear usuario administrador

Opción 1 - **Desde la API de Vercel (usando Postman o Thunder Client):**

```bash
POST https://tu-dominio.vercel.app/api/auth/register
Content-Type: application/json

{
  "email": "admin@rv.com",
  "password": "admin123",
  "nombre": "Administrador",
  "rol": "admin"
}
```

Opción 2 - **Desde Neon SQL Editor:**

```sql
-- Insertar usuario admin directamente
INSERT INTO "Usuario" (email, password, rol, "createdAt", "updatedAt")
VALUES (
  'admin@rv.com',
  '$2a$10$rK5Q8Z9Y8Z9Y8Z9Y8Z9Y8e.abcdefghijklmnopqrstuvwxyz123456', -- Usa bcrypt para generar hash
  'admin',
  NOW(),
  NOW()
);
```

---

## ✅ Paso 5: Verificación

### 5.1 Probar el frontend

1. Abre tu URL de Vercel: `https://tu-dominio.vercel.app`
2. Deberías ver la página de login de RV Automóviles
3. Verifica que el modo oscuro funciona (botón en la esquina superior derecha)

### 5.2 Probar el backend

1. Abre: `https://tu-dominio.vercel.app/api/health`
2. Deberías ver:
```json
{
  "status": "OK",
  "message": "RV Automoviles API está funcionando correctamente",
  "timestamp": "2025-10-18T..."
}
```

### 5.3 Probar login

1. Intenta iniciar sesión con:
   - Email: `admin@rv.com`
   - Contraseña: `admin123`
2. Si funciona, ¡felicidades! 🎉

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solución:**
1. Ve a Settings → Environment Variables en Vercel
2. Agrega: `PRISMA_GENERATE_DATAPROXY=true`
3. Redeploy

### Error: "Database connection failed"

**Solución:**
1. Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
2. Asegúrate de que incluye `?sslmode=require` al final
3. Verifica que tu proyecto Neon esté activo (no pausado)

### Error: "CORS policy blocked"

**Solución:**
1. Verifica que `FRONTEND_URL` esté correctamente configurada
2. Debe coincidir exactamente con tu dominio de Vercel (sin `/` al final)

### Error 500 en API calls

**Solución:**
1. Ve a Vercel → tu proyecto → Logs
2. Busca el error específico en los logs de Functions
3. Verifica que todas las variables de entorno estén configuradas

---

## 📝 Mantenimiento

### Actualizar código

```bash
# Local
git add .
git commit -m "feat: descripción de cambios"
git push origin main

# Vercel hace auto-deploy automáticamente
```

### Ver logs

1. Ve a tu proyecto en Vercel
2. Click en **"Functions"** → selecciona una función
3. Verás los logs en tiempo real

### Monitorear base de datos

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto
3. Usa **"Monitoring"** para ver métricas de uso

---

## 💰 Límites del Plan Gratuito

### Vercel Free Tier:
- ✅ Deployments ilimitados
- ✅ 100 GB de bandwidth/mes
- ✅ Serverless Functions con 100 GB-hours/mes
- ✅ Dominios personalizados

### Neon Free Tier:
- ✅ 1 proyecto
- ✅ 10 branches
- ✅ 3 GB de storage
- ✅ Unlimited queries (con límite de compute)

---

## 🎯 Próximos Pasos

1. ✅ Configura un dominio personalizado en Vercel (Settings → Domains)
2. ✅ Configura alertas de monitoreo
3. ✅ Implementa backups automáticos de Neon
4. ✅ Configura analytics (Vercel Analytics)

---

## 📞 Soporte

Si tienes problemas:

1. **Documentación Vercel**: [vercel.com/docs](https://vercel.com/docs)
2. **Documentación Neon**: [neon.tech/docs](https://neon.tech/docs)
3. **Documentación Prisma**: [prisma.io/docs](https://prisma.io/docs)

---

**¡Listo! Tu aplicación RV Automóviles ya está en producción! 🚗✨**
