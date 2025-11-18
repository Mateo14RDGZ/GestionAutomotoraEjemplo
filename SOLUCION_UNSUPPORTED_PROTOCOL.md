# 🔧 Solución al Error "Unsupported protocol C:"

## 🐛 Problema

Error: `Unsupported protocol C:`

Este error ocurre cuando Axios intenta hacer una petición a una URL inválida que parece una ruta de Windows (C:\...) en lugar de una URL HTTP.

## 💡 Causa

La variable de entorno `VITE_API_URL` no está configurada correctamente en Vercel, o el build no está usando el archivo `.env.production`.

## ✅ Solución (SIGUE ESTOS PASOS)

### 1️⃣ Configurar VITE_API_URL en Vercel

**IMPORTANTE:** Las variables de Vite (que empiezan con `VITE_`) deben estar configuradas en Vercel para que se incluyan en el build del frontend.

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto: **rv-gestion-automotora**
3. Ve a **Settings** → **Environment Variables**
4. **Agrega esta variable** (si no está):

```
Name: VITE_API_URL
Value: /api
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **Asegúrate de marcar las 3 opciones:** Production, Preview y Development

### 2️⃣ Hacer Redeploy

Después de agregar la variable:

1. Ve a **Deployments**
2. Click en el último deployment
3. Click en el menú (⋮) → **Redeploy**
4. Espera 2-3 minutos

### 3️⃣ Verificar el Build Local

Antes de hacer el deploy, prueba que el build funcione localmente:

```powershell
cd "c:\Users\poron\OneDrive\Desktop\Proyectos varios vs code\Administracion_RV_Automoviles\frontend"
npm run build
```

Deberías ver:
```
✓ built in XXXms
vite v5.x.x building for production...
```

**Si el build local falla, hay un problema con el código.**

### 4️⃣ Subir los Cambios

Ya actualicé el código para:
- ✅ Validar que la URL sea correcta
- ✅ Mostrar un log de la URL configurada
- ✅ Lanzar un error claro si la URL es inválida
- ✅ Build explícito en modo producción

Ahora sube los cambios:

```powershell
cd "c:\Users\poron\OneDrive\Desktop\Proyectos varios vs code\Administracion_RV_Automoviles"
git add .
git commit -m "Fix: Validación de VITE_API_URL y build en modo producción"
git push origin main
```

---

## 🧪 Probar Después del Deploy

### 1. Abrir la Consola del Navegador

1. Abre: https://rv-gestion-automotora20.vercel.app
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**

Deberías ver:
```
🔗 API URL configurada: /api
```

Si ves algo como:
```
❌ VITE_API_URL inválida: C:\Users\...
```

Significa que la variable no está configurada en Vercel.

### 2. Probar el Login

- Email: `admin@rvautomoviles.com`
- Contraseña: `Admin123!`

---

## 📋 Resumen de Variables de Entorno en Vercel

Asegúrate de tener **TODAS** estas variables configuradas:

### Variables del Backend (API)
1. `NODE_ENV` = `production`
2. `JWT_SECRET` = (tu secreto de 64+ caracteres)
3. `POSTGRES_PRISMA_URL` = (tu URL de Neon)
4. `POSTGRES_URL_NON_POOLING` = (tu URL de Neon)
5. `FRONTEND_URL` = `https://rv-gestion-automotora20.vercel.app`

### Variables del Frontend (VITE)
6. **`VITE_API_URL` = `/api`** ⬅️ **ESTA ES LA QUE FALTA**

---

## 🔍 Si el Error Persiste

### Opción A: Ver los Logs del Build

En Vercel:
1. Deployments → Click en el último
2. **View Build Logs**
3. Busca la línea que dice: `Environment Variables Exposed to Build`
4. Verifica que `VITE_API_URL` esté en la lista

### Opción B: Verificar el Bundle

En la consola del navegador:
1. Pestaña **Sources**
2. Busca `api.js` en el árbol de archivos
3. Verifica qué valor tiene `API_URL`

---

## 🎯 Acción Inmediata

1. ✅ **Ve a Vercel Dashboard → Settings → Environment Variables**
2. ✅ **Agrega `VITE_API_URL` = `/api`**
3. ✅ **Marca: Production, Preview y Development**
4. ✅ **Haz Redeploy**
5. ⏱️ **Espera 2-3 minutos**
6. ✅ **Prueba la app nuevamente**

Avísame cuando hayas agregado la variable y hecho el redeploy. 🚀
