# ✅ Sistema de Notificaciones Push - Implementación Completa

## 🎉 ¿Qué se implementó?

Se ha creado un **sistema completo de notificaciones push** que funciona **solo cuando la app PWA está instalada** en el dispositivo del usuario. Las notificaciones llegan incluso cuando la app está cerrada.

---

## 📁 Archivos Creados/Modificados

### **Frontend:**
- ✅ `frontend/src/services/notifications.js` - Servicio Firebase
- ✅ `frontend/src/hooks/useNotifications.js` - Hook React para notificaciones
- ✅ `frontend/src/components/NotificationPrompt.jsx` - Banner de activación
- ✅ `frontend/public/firebase-messaging-sw.js` - Service Worker de Firebase
- ✅ `frontend/package.json` - Agregado `firebase@10.7.1`
- ✅ `frontend/src/App.jsx` - Agregado `<NotificationPrompt />`

### **Backend:**
- ✅ `api/routes/notificaciones.routes.js` - Rutas de notificaciones
- ✅ `api/prisma/schema.prisma` - Modelo `NotificationToken`
- ✅ `api/package.json` - Agregado `firebase-admin@12.0.0`
- ✅ `api/index.js` - Agregada ruta `/api/notificaciones`

### **Configuración:**
- ✅ `vercel.json` - Cron job diario + headers para firebase-messaging-sw.js
- ✅ `.env.notifications.example` - Template de variables de entorno
- ✅ `GUIA_NOTIFICACIONES.md` - Guía completa paso a paso

---

## 🔔 Tipos de Notificaciones

### **1. Automáticas (Cron Job diario a las 9 AM UTC):**
- 📅 Recordatorio 7 días antes del vencimiento
- ⏰ Recordatorio 3 días antes del vencimiento
- ⚠️ Alerta de cuota vencida

### **2. Instantáneas:**
- ✅ Confirmación cuando admin marca cuota como pagada
- 🚗 Notificación cuando se crea nuevo plan de cuotas

---

## 📋 Próximos Pasos para Activar

### **Paso 1: Crear Proyecto Firebase (15 min)**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crear proyecto: `rv-automoviles`
3. Habilitar **Cloud Messaging**
4. Generar **VAPID Key** (Web Push certificates)
5. Obtener **Service Account** (credenciales backend)

### **Paso 2: Configurar Variables de Entorno**

#### **Frontend (.env):**
```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_VAPID_KEY=tu-vapid-key-publica
```

#### **Backend (.env):**
```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### **Vercel:**
- Agregar TODAS las variables en **Settings > Environment Variables**

### **Paso 3: Actualizar firebase-messaging-sw.js**

Editar `frontend/public/firebase-messaging-sw.js` con tu configuración real:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",           // ← Cambiar
  authDomain: "TU_AUTH_DOMAIN",   // ← Cambiar
  projectId: "TU_PROJECT_ID",     // ← Cambiar
  // ... etc
};
```

### **Paso 4: Migrar Base de Datos**

```bash
cd api
npx prisma migrate dev --name add-notification-tokens
npx prisma generate
```

Esto crea la tabla `NotificationToken`.

### **Paso 5: Instalar Dependencias**

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../api
npm install
```

### **Paso 6: Desplegar a Producción**

El código ya está en GitHub. Vercel lo desplegará automáticamente con las nuevas dependencias.

⚠️ **Importante:** Agrega las variables de entorno de Firebase en Vercel antes del deploy.

---

## 🧪 Cómo Probar

### **1. Instalar la PWA:**
- Abre la app en el navegador
- Clic en el botón flotante de descarga
- Instala la app en tu dispositivo

### **2. Activar Notificaciones:**
- Abre la **app instalada** (no el navegador)
- Aparecerá un banner azul
- Clic en **"Activar Notificaciones"**
- Acepta el permiso del navegador
- Recibirás notificación de prueba: "🎉 Notificaciones Activadas"

### **3. Probar Recordatorios:**

```bash
# Llamar endpoint manualmente
curl https://tu-app.vercel.app/api/notificaciones/enviar-recordatorios
```

O modifica una cuota en la BD para que venza en 3 días.

### **4. Probar Confirmación de Pago:**
- Como admin, marca una cuota como "Pagada"
- El cliente recibirá: "✅ Pago Confirmado"

---

## 🎯 Funcionalidades del Sistema

### **✅ Solo funciona si la app está instalada**
```javascript
isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}
```

### **✅ Notificaciones llegan con la app cerrada**
- Service Worker `firebase-messaging-sw.js` maneja notificaciones en segundo plano

### **✅ Cron Job automático**
- Ejecuta `/api/notificaciones/enviar-recordatorios` cada día a las 9 AM UTC
- Busca cuotas que vencen en 7 días, 3 días, o están vencidas
- Envía notificación a cada cliente automáticamente

### **✅ Gestión de tokens**
- Tokens FCM se guardan en tabla `NotificationToken`
- Tokens inválidos se eliminan automáticamente
- Un cliente puede tener múltiples tokens (varios dispositivos)

### **✅ Notificaciones interactivas**
- Botones de acción: "Ver Detalles", "Ver Comprobante"
- Redirección automática a la sección correcta al hacer clic

---

## 💰 Costos

### **Firebase (Plan Gratuito):**
- ✅ **10,000 notificaciones/día** gratis
- ✅ Suficiente para ~300 clientes con múltiples recordatorios

Para tu caso (100 clientes × 10 notificaciones/mes):
- **Costo mensual: $0** (dentro del plan gratuito)

### **Vercel Cron Jobs:**
- ⚠️ Requiere plan **Pro** ($20/mes)
- Alternativa gratuita: Usar [cron-job.org](https://cron-job.org) para llamar al endpoint

---

## 📱 Compatibilidad

### **Android:**
- ✅ Chrome, Firefox, Edge
- ✅ Notificaciones funcionan perfectamente
- ✅ Llegan con la app cerrada

### **iOS (Safari):**
- ✅ iOS 16.4+ soporta Web Push
- ⚠️ Solo funciona en apps instaladas (Add to Home Screen)
- ❌ No funciona en Safari browser normal

### **Desktop:**
- ✅ Chrome, Firefox, Edge
- ✅ Funciona en modo instalado

---

## 🔧 Endpoints Disponibles

### **POST /api/notificaciones/suscribir**
```javascript
// Suscribir token de dispositivo
{
  "token": "firebase-fcm-token-aqui"
}
```

### **POST /api/notificaciones/desuscribir**
```javascript
// Desuscribir token
{
  "token": "firebase-fcm-token-aqui"
}
```

### **GET /api/notificaciones/enviar-recordatorios**
```javascript
// Enviar recordatorios automáticos (llamado por cron)
// No requiere body
```

### **POST /api/notificaciones/pago-confirmado/:pagoId**
```javascript
// Notificar pago confirmado
// Llamar cuando admin marca cuota como pagada
```

---

## 🎨 UI del Sistema

### **Banner de Activación:**
- Aparece solo si la app está instalada
- Solo si no tiene notificaciones activadas
- Se oculta automáticamente después de activar
- Se puede cerrar (reaparece en 7 días)

### **Notificaciones:**
- Diseño profesional con emojis
- Información clara del monto y cuota
- Botones de acción interactivos
- Vibración al llegar

---

## ⚠️ Limitaciones Conocidas

1. **Cron Jobs de Vercel:**
   - Requieren plan Pro ($20/mes)
   - Alternativa: Usar servicio externo gratuito

2. **iOS Safari:**
   - Solo funciona en apps instaladas
   - No funciona en browser normal

3. **Notificaciones retrasadas:**
   - Firebase puede retrasar notificaciones en segundo plano (batería)
   - Usualmente llegan en 1-5 segundos

---

## 📚 Documentación

- **Guía completa:** `GUIA_NOTIFICACIONES.md`
- **Variables de entorno:** `.env.notifications.example`
- **Firebase Docs:** https://firebase.google.com/docs/cloud-messaging

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa la consola del navegador** (DevTools)
2. **Verifica las variables de entorno** en Vercel
3. **Consulta `GUIA_NOTIFICACIONES.md`** para troubleshooting

---

## ✨ Próximas Mejoras Opcionales

- [ ] Panel admin para enviar notificaciones personalizadas
- [ ] Estadísticas de notificaciones enviadas/leídas
- [ ] Configuración de horarios preferidos por cliente
- [ ] Notificaciones con imágenes (rich notifications)
- [ ] Notificaciones agrupadas (summary notifications)

---

**¡Sistema listo para producción!** 🚀

Solo falta configurar Firebase y agregar las variables de entorno en Vercel.
