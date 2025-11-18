# 🚀 Guía Completa Paso a Paso: Deploy en Vercel

## 📋 Índice

1. [Preparación del Proyecto](#1-preparación-del-proyecto)
2. [Configuración de Base de Datos (Neon)](#2-configuración-de-base-de-datos-neon)
3. [Configuración en Vercel](#3-configuración-en-vercel)
4. [Variables de Entorno](#4-variables-de-entorno)
5. [Primer Deployment](#5-primer-deployment)
6. [Inicialización de Base de Datos](#6-inicialización-de-base-de-datos)
7. [Verificación Final](#7-verificación-final)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Preparación del Proyecto

### ✅ Verificar que el código esté en GitHub

1. Abre tu terminal en la carpeta del proyecto
2. Verifica que estás en la rama `main` o `master`:
   ```bash
   git branch
   ```
3. Si hay cambios sin commitear, haz commit:
   ```bash
   git add .
   git commit -m "Preparación para deploy en Vercel"
   git push origin main
   ```

### ✅ Verificar estructura del proyecto

Asegúrate de que tu proyecto tenga esta estructura:

```
Administracion_RV_Automoviles/
├── api/
│   ├── index.js
│   ├── lib/
│   │   ├── prisma.js
│   │   └── auth.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── backend/
│   └── routes/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── vercel.json
└── package.json
```

---

## 2. Configuración de Base de Datos (Neon)

### Paso 2.1: Crear cuenta en Neon

1. Ve a [https://neon.tech](https://neon.tech)
2. Haz clic en **"Sign Up"** o **"Get Started"**
3. Regístrate con GitHub, Google o email
4. Confirma tu email si es necesario

### Paso 2.2: Crear Proyecto en Neon

1. Una vez dentro del dashboard, haz clic en **"Create a project"**
2. Configura el proyecto:
   - **Project name**: `rv-automoviles-db` (o el nombre que prefieras)
   - **Region**: Selecciona la más cercana a tus usuarios (ej: `us-east-2`)
   - **Postgres version**: Usa la versión más reciente (16 o superior)
3. Haz clic en **"Create project"**
4. Espera 1-2 minutos mientras se crea la base de datos

### Paso 2.3: Obtener URLs de Conexión

1. En el dashboard de Neon, busca la sección **"Connection Details"** o **"Connection string"**
2. Verás dos tipos de conexión:

   **a) Pooled connection (con pgbouncer):**

   - Esta es la que usarás para `POSTGRES_PRISMA_URL`
   - Debe incluir `?pgbouncer=true` o `?sslmode=require&pgbouncer=true`
   - Ejemplo: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true`

   **b) Direct connection (sin pooling):**

   - Esta es la que usarás para `POSTGRES_URL_NON_POOLING`
   - NO debe incluir `pgbouncer`
   - Ejemplo: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

3. **⚠️ IMPORTANTE**: Copia ambas URLs y guárdalas en un lugar seguro (notas, documento de texto, etc.)
   - Las necesitarás en el siguiente paso

---

## 3. Configuración en Vercel

### Paso 3.1: Crear cuenta en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"** (recomendado) o tu método preferido
4. Autoriza a Vercel a acceder a tus repositorios

### Paso 3.2: Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New Project"** o **"New Project"**
2. Si es la primera vez, conecta tu cuenta de GitHub:
   - Haz clic en **"Import Git Repository"**
   - Autoriza a Vercel si es necesario
3. Busca tu repositorio: `Administracion_RV_Automoviles` (o el nombre que tenga)
4. Haz clic en **"Import"**

### Paso 3.3: Configurar Proyecto

En la pantalla de configuración del proyecto:

1. **Framework Preset**:

   - Selecciona **"Other"** o **"Vite"** (Vercel puede detectarlo automáticamente)

2. **Root Directory**:

   - Deja vacío (`.`) o escribe `.` si te lo pide

3. **Build Command**:

   - **DEJA VACÍO** - Vercel usará el comando del `vercel.json`

4. **Output Directory**:

   - **DEJA VACÍO** - Vercel usará la configuración del `vercel.json`

5. **Install Command**:
   - **DEJA VACÍO** - Vercel instalará automáticamente

---

## 4. Variables de Entorno

### Paso 4.1: Generar JWT Secret

Necesitas una clave secreta para los tokens JWT. Genera una en tu terminal:

**En Windows (PowerShell):**

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**En Mac/Linux:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**O usa un generador online:**

- Ve a [https://randomkeygen.com/](https://randomkeygen.com/)
- Copia una "CodeIgniter Encryption Key" (64 caracteres)

**Ejemplo de resultado:**

```
a3f8b9c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
```

**⚠️ GUARDA ESTA CLAVE** - La necesitarás en el siguiente paso

### Paso 4.2: Agregar Variables en Vercel

En la misma pantalla de configuración del proyecto, busca la sección **"Environment Variables"**:

#### Variable 1: NODE_ENV

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 2: POSTGRES_PRISMA_URL

- **Name**: `POSTGRES_PRISMA_URL`
- **Value**: (Pega la URL de Neon con `pgbouncer=true`)
- **Environment**: Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 3: POSTGRES_URL_NON_POOLING

- **Name**: `POSTGRES_URL_NON_POOLING`
- **Value**: (Pega la URL de Neon SIN `pgbouncer`)
- **Environment**: Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 4: JWT_SECRET

- **Name**: `JWT_SECRET`
- **Value**: (Pega la clave que generaste en el paso 4.1)
- **Environment**: Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 5: VITE_API_URL

- **Name**: `VITE_API_URL`
- **Value**: `/api`
- **Environment**: Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 6: FRONTEND_URL (Temporal)

- **Name**: `FRONTEND_URL`
- **Value**: `https://` (lo completarás después del primer deploy)
- **Environment**: Solo marca:
  - ✅ Production

**⚠️ IMPORTANTE**:

- Haz clic en **"Add"** después de cada variable
- Verifica que todas las variables estén listadas antes de continuar

---

## 5. Primer Deployment

### Paso 5.1: Iniciar Deployment

1. Una vez agregadas todas las variables de entorno, haz clic en **"Deploy"**
2. Espera 2-4 minutos mientras Vercel:
   - Instala dependencias del frontend
   - Instala dependencias de la API
   - Genera el cliente de Prisma
   - Construye el frontend
   - Despliega las funciones serverless

### Paso 5.2: Verificar Build

Durante el build, verás logs en tiempo real. Debes ver:

- ✅ "Installing dependencies..."
- ✅ "Running postinstall script..." (genera Prisma Client)
- ✅ "Building frontend..."
- ✅ "Deployment ready"

**Si hay errores:**

- Revisa la sección [Solución de Problemas](#8-solución-de-problemas)
- Verifica los logs en Vercel

### Paso 5.3: Obtener URL del Proyecto

Una vez completado el deployment:

1. Verás un mensaje: **"Deployment Ready"**
2. Copia la URL que aparece (ejemplo: `https://administracion-rv-automoviles.vercel.app`)
3. **Guarda esta URL** - La necesitarás en el siguiente paso

### Paso 5.4: Actualizar FRONTEND_URL

1. En el dashboard de Vercel, ve a tu proyecto
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral, haz clic en **"Environment Variables"**
4. Busca la variable `FRONTEND_URL`
5. Haz clic en el ícono de editar (lápiz)
6. Cambia el valor a tu URL completa:
   - Ejemplo: `https://administracion-rv-automoviles.vercel.app`
7. Haz clic en **"Save"**
8. Ve a **"Deployments"** (Despliegues)
9. Haz clic en el último deployment
10. Haz clic en el menú de 3 puntos (⋯) → **"Redeploy"**
11. Confirma el redeploy

---

## 6. Inicialización de Base de Datos

Ahora necesitas crear las tablas en tu base de datos PostgreSQL.

### Paso 6.1: Instalar Prisma CLI Localmente

Abre tu terminal en la carpeta del proyecto:

```bash
cd api
npm install
```

Esto instalará Prisma y todas las dependencias necesarias.

### Paso 6.2: Configurar Variables Locales

Crea un archivo `.env` en la carpeta `/api`:

**En Windows (PowerShell):**

```powershell
cd api
@"
POSTGRES_PRISMA_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
"@ | Out-File -FilePath ".env" -Encoding utf8
```

**En Mac/Linux:**

```bash
cd api
cat > .env << EOF
POSTGRES_PRISMA_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
EOF
```

**⚠️ IMPORTANTE**:

- Reemplaza `user:password@ep-xxx...` con tus URLs reales de Neon
- Usa las mismas URLs que copiaste en el paso 2.3

### Paso 6.3: Crear Tablas en la Base de Datos

Ejecuta este comando para crear las tablas:

```bash
npx prisma db push
```

Deberías ver:

```
✅ Database is now in sync with your schema
```

Si hay errores, verifica:

- Que las URLs en `.env` sean correctas
- Que la base de datos en Neon esté activa
- Que tengas conexión a internet

### Paso 6.4: Crear Usuario Administrador

Necesitas crear el primer usuario admin para poder iniciar sesión.

#### Opción A: Usando Prisma Studio (Recomendado)

1. Abre Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Se abrirá una ventana en tu navegador en `http://localhost:5555`
3. Haz clic en el modelo **"Usuario"**
4. Haz clic en **"Add record"** o el botón **"+"**
5. Completa los campos:
   - `email`: `admin@rvautomoviles.com` (o tu email)
   - `password`: (genera un hash - ver abajo)
   - `rol`: `admin`
6. Haz clic en **"Save 1 change"**

**Para generar el hash de la contraseña:**

Abre otra terminal y ejecuta:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('TuContraseñaSegura123', 10).then(h=>console.log(h))"
```

Reemplaza `TuContraseñaSegura123` con la contraseña que quieras usar.

Copia el resultado (será algo como `$2a$10$...`) y pégalo en el campo `password` en Prisma Studio.

#### Opción B: Usando Script

Crea un archivo `create-admin.js` en la carpeta `/api`:

```javascript
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@rvautomoviles.com";
  const password = "Admin123!"; // Cambia esto por tu contraseña

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      rol: "admin",
    },
  });

  console.log("✅ Usuario admin creado:");
  console.log("Email:", admin.email);
  console.log("Contraseña:", password);
  console.log("⚠️ Guarda estas credenciales en un lugar seguro");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

Ejecuta:

```bash
node create-admin.js
```

**⚠️ IMPORTANTE**: Guarda las credenciales del admin en un lugar seguro.

---

## 7. Verificación Final

### Paso 7.1: Verificar Frontend

1. Ve a tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Deberías ver la **página de login**
3. ✅ Si aparece correctamente, el frontend funciona

### Paso 7.2: Verificar API

Abre en tu navegador:

```
https://tu-proyecto.vercel.app/api/health
```

Deberías ver un JSON como:

```json
{
  "status": "OK",
  "message": "RV Automoviles API funcionando correctamente",
  "timestamp": "2025-01-XXT..."
}
```

✅ Si ves esto, la API funciona.

### Paso 7.3: Probar Login

1. Ve a la página de login: `https://tu-proyecto.vercel.app/login`
2. Ingresa las credenciales del admin que creaste:
   - **Email**: `admin@rvautomoviles.com` (o el que usaste)
   - **Contraseña**: (la que configuraste)
3. Haz clic en **"Iniciar Sesión"**

✅ Si entras al dashboard, ¡todo funciona correctamente!

### Paso 7.4: Probar Funcionalidades

Verifica cada módulo:

- ✅ **Dashboard**: Muestra estadísticas (puede estar vacío al inicio)
- ✅ **Clientes**: Crear, editar, eliminar
- ✅ **Autos**: Crear, editar, eliminar
- ✅ **Pagos**: Crear cuotas, registrar pagos
- ✅ **Reportes**: Generar PDFs

---

## 8. Solución de Problemas

### Error: "Build failed" o "Deployment failed"

**Causas comunes:**

1. Variables de entorno faltantes
2. Errores de sintaxis en el código
3. Dependencias faltantes

**Solución:**

1. Ve a Vercel → Tu proyecto → **Deployments**
2. Haz clic en el deployment fallido
3. Revisa los **"Build Logs"**
4. Busca el error específico
5. Corrige el problema y haz push a GitHub
6. Vercel redeployará automáticamente

### Error: "404 NOT_FOUND" en el frontend

**Causa**: El frontend no se está sirviendo correctamente.

**Solución:**

1. Ve a Vercel → Settings → General
2. Verifica:
   - Framework: "Other" o "Vite"
   - Build Command: (debe estar vacío o usar el de vercel.json)
   - Output Directory: `frontend/dist`
3. Guarda y redeploy

### Error: "Failed to load resource: 404" en /api

**Causa**: Las funciones serverless no se están desplegando.

**Solución:**

1. Verifica que existe la carpeta `/api` en tu repo
2. Verifica que `api/index.js` existe
3. Verifica que `vercel.json` tiene el rewrite correcto:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/index.js"
       }
     ]
   }
   ```
4. Redeploy el proyecto

### Error: "Database connection failed"

**Causa**: Las variables de Neon no están configuradas correctamente.

**Solución:**

1. Ve a Neon dashboard y copia nuevamente las URLs
2. Asegúrate de que `POSTGRES_PRISMA_URL` tiene `?pgbouncer=true` o `&pgbouncer=true`
3. Asegúrate de que `POSTGRES_URL_NON_POOLING` NO tiene `pgbouncer`
4. Actualiza las variables en Vercel → Settings → Environment Variables
5. Redeploy

### Error: "Token inválido" al hacer login

**Causa**: `JWT_SECRET` no está configurado o es diferente.

**Solución:**

1. Genera un nuevo JWT_SECRET (paso 4.1)
2. Actualiza la variable en Vercel
3. Redeploy
4. Los usuarios existentes deberán volver a iniciar sesión

### Error: "prisma: command not found" durante build

**Causa**: Prisma no se está instalando correctamente.

**Solución:**

1. Verifica que `api/package.json` tiene `prisma` en dependencies
2. Verifica que el script postinstall está correcto:
   ```json
   "postinstall": "npx prisma generate --schema=./prisma/schema.prisma"
   ```
3. Verifica que `api/prisma/schema.prisma` existe
4. Redeploy

### Error: "Cannot find module '../backend/routes/...'"

**Causa**: Los paths relativos no funcionan en Vercel.

**Solución:**

1. Verifica que la estructura de carpetas es correcta
2. Verifica que `api/index.js` tiene los paths correctos:
   ```javascript
   const authRoutes = require("../backend/routes/auth.routes");
   ```
3. Si el error persiste, verifica que el directorio `backend/routes/` existe en el repo

### Frontend carga pero API no responde

**Causa**: La variable `VITE_API_URL` no está configurada correctamente.

**Solución:**

1. Verifica que `VITE_API_URL` está configurada como `/api` en Vercel
2. Verifica que está marcada para Production, Preview y Development
3. Redeploy el frontend

---

## ✅ Checklist Final

Antes de considerar el deployment completo, verifica:

- [ ] Frontend carga correctamente en la URL de Vercel
- [ ] API responde en `/api/health`
- [ ] Login funciona con las credenciales del admin
- [ ] Dashboard se muestra correctamente
- [ ] Puedes crear un cliente
- [ ] Puedes crear un auto
- [ ] Puedes generar cuotas de pago
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs de Vercel

---

## 🎉 ¡Deployment Completado!

Tu aplicación ya está en producción. Puedes:

- ✅ Acceder desde cualquier dispositivo con internet
- ✅ Compartir la URL con tus usuarios
- ✅ El sistema se actualiza automáticamente con cada push a GitHub
- ✅ La base de datos está en Neon (backups automáticos)
- ✅ Todo es GRATIS (dentro de los límites de los planes free)

---

## 📊 Monitoreo y Mantenimiento

### Ver Logs de Errores

1. Ve a Vercel → Tu proyecto
2. Haz clic en **Deployments**
3. Selecciona un deployment
4. Haz clic en **"View Function Logs"** o **"Logs"**

### Actualizar la Aplicación

Simplemente haz cambios en tu código y:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel detectará el push y hará un nuevo deploy automáticamente.

### Actualizar Base de Datos (Schema)

Si cambias el schema de Prisma:

1. Edita `api/prisma/schema.prisma`
2. Haz commit y push
3. Localmente, ejecuta:
   ```bash
   cd api
   npx prisma db push
   ```

---

## 🆘 Soporte Adicional

Si encuentras problemas que no están en esta guía:

1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Asegúrate de que Neon esté activo
4. Verifica la conexión a internet
5. Consulta la documentación oficial:
   - [Vercel Docs](https://vercel.com/docs)
   - [Neon Docs](https://neon.tech/docs)
   - [Prisma Docs](https://www.prisma.io/docs)

---

**¡Éxito con tu aplicación RV Automóviles! 🚗💨**
