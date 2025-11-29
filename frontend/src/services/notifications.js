// Servicio de notificaciones push para PWA
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuración de Firebase (reemplazar con tus credenciales)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

class NotificationService {
  constructor() {
    this.app = null;
    this.messaging = null;
    this.currentToken = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Verificar si la app está instalada (modo standalone)
  isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Inicializar Firebase
  async initialize() {
    if (!this.isSupported) {
      console.log('⚠️ Notificaciones no soportadas');
      return false;
    }

    // Solo inicializar si la app está instalada
    if (!this.isAppInstalled()) {
      console.log('⚠️ App no instalada, notificaciones deshabilitadas');
      return false;
    }

    try {
      // Inicializar Firebase
      this.app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(this.app);
      
      console.log('✅ Firebase inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error);
      return false;
    }
  }

  // Solicitar permiso y obtener token
  async requestPermission() {
    if (!this.isAppInstalled()) {
      console.log('⚠️ App no instalada');
      return null;
    }

    try {
      // Solicitar permiso al usuario
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('⚠️ Permiso de notificaciones denegado');
        return null;
      }

      console.log('✅ Permiso de notificaciones concedido');

      // Inicializar Firebase si no está inicializado
      if (!this.messaging) {
        await this.initialize();
      }

      // Obtener token de FCM
      const token = await getToken(this.messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });

      if (token) {
        console.log('✅ Token FCM obtenido:', token.substring(0, 20) + '...');
        this.currentToken = token;
        return token;
      } else {
        console.log('⚠️ No se pudo obtener el token FCM');
        return null;
      }
    } catch (error) {
      console.error('❌ Error al solicitar permiso:', error);
      return null;
    }
  }

  // Escuchar mensajes cuando la app está abierta
  onMessageReceived(callback) {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('📩 Mensaje recibido (app abierta):', payload);
      
      // Mostrar notificación personalizada
      const { title, body, icon } = payload.notification || {};
      
      if (title && body) {
        this.showLocalNotification(title, body, icon);
      }
      
      // Llamar callback si existe
      if (callback) {
        callback(payload);
      }
    });
  }

  // Mostrar notificación local
  async showLocalNotification(title, body, icon = '/assets/icon-192.png') {
    if ('Notification' in window && Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(title, {
        body,
        icon,
        badge: '/assets/icon-72.png',
        vibrate: [200, 100, 200],
        tag: `notification-${Date.now()}`,
        data: { timestamp: Date.now() }
      });
    }
  }

  // Obtener token actual
  getToken() {
    return this.currentToken;
  }

  // Verificar si tiene permiso
  hasPermission() {
    return Notification.permission === 'granted';
  }
}

// Exportar instancia única
const notificationService = new NotificationService();
export default notificationService;
