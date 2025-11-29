// Hook de React para gestionar notificaciones push
import { useState, useEffect } from 'react';
import notificationService from '../services/notifications';
import api from '../services/api';

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStatus();

    // Escuchar cambios en el modo de visualización
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkStatus();
    displayModeQuery.addEventListener('change', handleChange);

    return () => {
      displayModeQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const checkStatus = () => {
    const installed = notificationService.isAppInstalled();
    const permission = notificationService.hasPermission();
    const token = notificationService.getToken();
    
    setIsAppInstalled(installed);
    setHasPermission(permission);
    setFcmToken(token);
    setIsEnabled(installed && permission && token !== null);

    console.log('📊 Estado notificaciones:', { installed, permission, hasToken: !!token });
  };

  // Activar notificaciones
  const enableNotifications = async () => {
    if (!isAppInstalled) {
      console.log('⚠️ Primero debes instalar la app');
      return false;
    }

    setIsLoading(true);

    try {
      // Inicializar Firebase
      await notificationService.initialize();

      // Solicitar permiso y obtener token
      const token = await notificationService.requestPermission();
      
      if (!token) {
        console.log('⚠️ No se pudo obtener el token');
        setIsLoading(false);
        return false;
      }

      // Guardar token en el backend
      await api.post('/notificaciones/suscribir', { token });
      
      console.log('✅ Notificaciones activadas exitosamente');
      
      setFcmToken(token);
      setHasPermission(true);
      setIsEnabled(true);
      setIsLoading(false);

      // Configurar listener para mensajes cuando la app está abierta
      notificationService.onMessageReceived((payload) => {
        console.log('📩 Notificación recibida:', payload);
      });

      return true;
    } catch (error) {
      console.error('❌ Error al activar notificaciones:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Desactivar notificaciones
  const disableNotifications = async () => {
    try {
      if (fcmToken) {
        await api.post('/notificaciones/desuscribir', { token: fcmToken });
      }
      
      setIsEnabled(false);
      setFcmToken(null);
      console.log('✅ Notificaciones desactivadas');
      return true;
    } catch (error) {
      console.error('❌ Error al desactivar notificaciones:', error);
      return false;
    }
  };

  return {
    isEnabled,
    hasPermission,
    isAppInstalled,
    fcmToken,
    isLoading,
    enableNotifications,
    disableNotifications
  };
}
