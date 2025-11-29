// Service Worker de Firebase para notificaciones push en segundo plano
// Este archivo maneja las notificaciones cuando la app está cerrada

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con frontend)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano (app cerrada)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'RV Automóviles';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: payload.notification?.icon || '/assets/icon-192.png',
    badge: '/assets/icon-72.png',
    vibrate: [200, 100, 200],
    tag: payload.data?.tag || `notification-${Date.now()}`,
    requireInteraction: payload.data?.requireInteraction === 'true',
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    },
    actions: []
  };

  // Agregar acciones si existen
  if (payload.data?.actions) {
    try {
      const actions = JSON.parse(payload.data.actions);
      notificationOptions.actions = actions;
    } catch (e) {
      console.error('Error al parsear acciones:', e);
    }
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clic en la notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notificación clickeada:', event.notification);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  // Manejar acciones
  if (event.action) {
    console.log('[firebase-messaging-sw.js] Acción:', event.action);
    
    // Puedes manejar diferentes acciones aquí
    switch (event.action) {
      case 'view':
        event.waitUntil(clients.openWindow(urlToOpen));
        break;
      case 'dismiss':
        // Solo cerrar la notificación
        break;
      default:
        event.waitUntil(clients.openWindow(urlToOpen));
    }
  } else {
    // Clic en el cuerpo de la notificación
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Si hay una ventana abierta, enfocarla
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Si no hay ventana abierta, abrir una nueva
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
