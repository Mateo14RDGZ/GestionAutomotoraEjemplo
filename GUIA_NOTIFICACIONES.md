# 🔔 Guía de Configuración de Notificaciones Push

## ✅ Sistema Implementado

El sistema de notificaciones push **solo funciona cuando la app está instalada** en el dispositivo del usuario. Utiliza Firebase Cloud Messaging (FCM) para enviar notificaciones que llegan incluso cuando la app está cerrada.

---

## 📋 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en **"Agregar proyecto"**
3. Nombre: `rv-automoviles` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Clic en **"Crear proyecto"**

---

## 🔥 Paso 2: Configurar Cloud Messaging

### 2.1 Habilitar Cloud Messaging

1. En tu proyecto Firebase, ve a **"Build" > "Cloud Messaging"**
2. La API ya debería estar habilitada automáticamente

### 2.2 Generar VAPID Key (Web Push)

1. Ve a **"Project Settings"** (⚙️ en el menú lateral)
2. Pestaña **"Cloud Messaging"**
3. Scroll down hasta **"Web Push certificates"**
4. Clic en **"Generate key pair"**
5. **Copia la clave** que aparece (empieza con `B...`)

### 2.3 Obtener Configuración Web

1. En **"Project Settings"** > pestaña **"General"**
2. Scroll down hasta **"Your apps"**
3. Clic en el ícono **</>** (Web)
4. Nombre de la app: `RV Autos Web`
5. También selecciona **"Also set up Firebase Hosting"**
6. Clic en **"Register app"**
7. **Copia** el objeto `firebaseConfig` que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rv-automoviles.firebaseapp.com",
  projectId: "rv-automoviles",
  storageBucket: "rv-automoviles.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔑 Paso 3: Generar Credenciales del Backend

### 3.1 Crear Service Account

1. En **"Project Settings"** > pestaña **"Service accounts"**
2. Clic en **"Generate new private key"**
3. Confirma clic en **"Generate key"**
4. Se descargará un archivo JSON con este formato:

```json
{
  "type": "service_account",
  "project_id": "rv-automoviles",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@rv-automoviles.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

5. **Guarda este archivo de forma segura** (no lo subas a GitHub)

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### 4.1 Frontend (.env)

Crea o actualiza el archivo `frontend/.env`:

```env
# Firebase Cloud Messaging - Frontend
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=rv-automoviles.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rv-automoviles
VITE_FIREBASE_STORAGE_BUCKET=rv-automoviles.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_VAPID_KEY=BPx...tu-vapid-key-aqui...
```

### 4.2 Backend (.env)

Crea o actualiza el archivo `api/.env`:

```env
# Firebase Cloud Messaging - Backend
FIREBASE_PROJECT_ID=rv-automoviles
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@rv-automoviles.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_COMPLETA_AQUI\n-----END PRIVATE KEY-----\n"
```

⚠️ **Importante:** La `FIREBASE_PRIVATE_KEY` debe incluir los saltos de línea (`\n`)

### 4.3 Vercel (Producción)

1. Ve a tu proyecto en Vercel
2. **Settings** > **Environment Variables**
3. Agrega **TODAS** las variables del frontend y backend
4. ✅ Marca ambos entornos: **Production** y **Preview**
5. Clic en **Save**

---

## 🔧 Paso 5: Actualizar firebase-messaging-sw.js

Abre `frontend/public/firebase-messaging-sw.js` y reemplaza la configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",           // Reemplazar
  authDomain: "TU_AUTH_DOMAIN",   // Reemplazar
  projectId: "TU_PROJECT_ID",     // Reemplazar
  storageBucket: "TU_STORAGE_BUCKET", // Reemplazar
  messagingSenderId: "TU_MESSAGING_SENDER_ID", // Reemplazar
  appId: "TU_APP_ID"              // Reemplazar
};
```

---

## 🗄️ Paso 6: Crear Tabla de Tokens en Base de Datos

Ejecuta la migración de Prisma:

```bash
cd api
npx prisma migrate dev --name add-notification-tokens
npx prisma generate
```

Esto creará la tabla `NotificationToken` en tu base de datos Neon.

---

## 🚀 Paso 7: Configurar Cron Job en Vercel

Crea o actualiza `vercel.json` en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/notificaciones/enviar-recordatorios",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Esto ejecutará el envío de recordatorios **todos los días a las 9 AM** (UTC).

⚠️ **Nota:** Los Cron Jobs solo funcionan en planes **Pro** de Vercel ($20/mes).

**Alternativa Gratuita:** Usar un servicio externo como [cron-job.org](https://cron-job.org) para llamar al endpoint cada día.

---

## 🧪 Paso 8: Probar el Sistema

### 8.1 Desarrollo Local

```bash
# Terminal 1 - Backend
cd api
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 8.2 Instalar la PWA

1. Abre `http://localhost:5173` en tu navegador
2. Clic en el **botón flotante de descarga** (esquina inferior derecha)
3. Sigue las instrucciones para instalar
4. Abre la app instalada

### 8.3 Activar Notificaciones

1. Debería aparecer un banner azul pidiendo activar notificaciones
2. Clic en **"Activar Notificaciones"**
3. Acepta el permiso del navegador
4. Deberías recibir una notificación de prueba: "🎉 Notificaciones Activadas"

### 8.4 Probar Recordatorios

Opción 1 - Manualmente:
```bash
curl http://localhost:3000/api/notificaciones/enviar-recordatorios
```

Opción 2 - Modificar fecha de vencimiento:
1. Ve a la base de datos
2. Modifica una cuota para que venza en 3 días
3. Llama al endpoint de recordatorios
4. Deberías recibir la notificación

### 8.5 Probar Confirmación de Pago

1. Como admin, marca una cuota como **"Pagada"**
2. El cliente debería recibir: "✅ Pago Confirmado"

---

## 📊 Verificar que Funciona

### Check Frontend

1. Abre DevTools > Console
2. Deberías ver:
   ```
   ✅ Firebase inicializado
   ✅ Permiso de notificaciones concedido
   ✅ Token FCM obtenido: BP...
   ```

### Check Backend

1. Mira los logs del servidor
2. Deberías ver:
   ```
   ✅ Firebase Admin inicializado
   ✅ Token suscrito para cliente 1
   ```

### Check Base de Datos

```sql
SELECT * FROM "NotificationToken";
```

Deberías ver registros con tokens y clienteId.

---

## 🔔 Tipos de Notificaciones Implementadas

### 1. Recordatorio 7 días antes
- **Título:** "📅 Recordatorio de Pago - RV Automóviles"
- **Cuerpo:** "Tu cuota #5 vence en 7 días - Monto: $800"
- **Cuándo:** Cron job diario a las 9 AM

### 2. Recordatorio 3 días antes
- **Título:** "⏰ Recordatorio Importante - RV Automóviles"
- **Cuerpo:** "Tu cuota #5 vence en 3 días - Monto: $800"
- **Cuándo:** Cron job diario a las 9 AM
- **Requiere interacción:** Sí

### 3. Cuota Vencida
- **Título:** "⚠️ Cuota Vencida - RV Automóviles"
- **Cuerpo:** "Tu cuota #5 venció hoy - Monto: $800"
- **Cuándo:** Cron job diario a las 9 AM
- **Requiere interacción:** Sí

### 4. Pago Confirmado
- **Título:** "✅ Pago Confirmado - RV Automóviles"
- **Cuerpo:** "Tu cuota #5 de $800 ha sido confirmada. ¡Gracias!"
- **Cuándo:** Cuando admin marca cuota como pagada
- **Requiere interacción:** Sí
- **Acciones:** [Ver Comprobante]

---

## ❓ Solución de Problemas

### Problema: No aparece el banner de notificaciones

**Solución:**
- Verifica que la app esté instalada (modo standalone)
- Abre DevTools > Console y busca mensajes de error
- Verifica que las variables de entorno estén correctas

### Problema: Error "Firebase not initialized"

**Solución:**
- Revisa que TODAS las variables `VITE_FIREBASE_*` estén en `.env`
- Reinicia el servidor de desarrollo
- Limpia caché: `npm run dev -- --force`

### Problema: Token FCM no se guarda en BD

**Solución:**
- Verifica que el backend tenga las credenciales correctas
- Revisa los logs del backend
- Verifica que la migración de Prisma se haya ejecutado

### Problema: Cron job no ejecuta

**Solución:**
- Los cron jobs de Vercel requieren plan Pro
- Alternativa: Usa cron-job.org para llamar al endpoint
- O implementa un worker en otro servicio (Railway, Render, etc.)

### Problema: Notificaciones no llegan cuando la app está cerrada

**Solución:**
- Verifica que `firebase-messaging-sw.js` esté correctamente configurado
- Revisa que el Service Worker esté registrado (DevTools > Application > Service Workers)
- En iOS, las notificaciones web push tienen limitaciones

---

## 🎯 Próximos Pasos

1. ✅ Configurar Firebase
2. ✅ Agregar variables de entorno
3. ✅ Ejecutar migración de BD
4. ✅ Probar en desarrollo
5. ✅ Desplegar a producción
6. ✅ Configurar cron job
7. ✅ Probar con usuarios reales

---

## 📱 Limitaciones de iOS

⚠️ **Importante:** Safari en iOS tiene soporte limitado para notificaciones web push:

- **iOS 16.4+:** Soporte para Web Push, pero solo en apps instaladas
- **Requiere:** La app debe estar agregada a la pantalla de inicio
- **No funciona:** En Safari browser normal

Para iOS, asegúrate de que los clientes:
1. Instalen la app (Add to Home Screen)
2. Abran la app instalada (no Safari)
3. Activen las notificaciones desde ahí

---

## 💰 Costos de Firebase

### Plan Gratuito (Spark)
- ✅ 10,000 notificaciones/día
- ✅ Suficiente para ~300 clientes

### Plan Pago (Blaze)
- 💵 $0.01 por cada 1,000 notificaciones
- Para 100 clientes × 10 notificaciones/mes = **$0.01/mes**

**Conclusión:** Prácticamente gratis para tu caso de uso.

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en DevTools Console
2. Verifica las variables de entorno
3. Consulta la [Documentación de Firebase](https://firebase.google.com/docs/cloud-messaging)

---

**¡Sistema de notificaciones listo para producción!** 🚀
