// Banner para activar notificaciones push (solo si la app está instalada)
import { useState, useEffect } from 'react';
import { Bell, X, Check, Smartphone } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationPrompt() {
  const { isEnabled, isAppInstalled, isLoading, enableNotifications } = useNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Solo mostrar si la app está instalada y no tiene notificaciones activadas
    if (isAppInstalled && !isEnabled) {
      // Verificar si el usuario ya cerró el banner
      const dismissed = localStorage.getItem('notification-banner-dismissed');
      
      if (!dismissed) {
        // Mostrar después de 3 segundos
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // Verificar si pasaron 7 días
        const dismissedDate = new Date(dismissed);
        const now = new Date();
        const daysPassed = Math.floor((now - dismissedDate) / (1000 * 60 * 60 * 24));

        if (daysPassed >= 7) {
          localStorage.removeItem('notification-banner-dismissed');
          const timer = setTimeout(() => {
            setShowBanner(true);
          }, 3000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isAppInstalled, isEnabled]);

  const handleActivate = async () => {
    const success = await enableNotifications();
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('notification-banner-dismissed', new Date().toISOString());
  };

  // No mostrar si app no está instalada o ya tiene notificaciones
  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 animate-slideDown">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/90 dark:to-indigo-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative p-5">
          {/* Botón cerrar */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {showSuccess ? (
            // Mensaje de éxito
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ¡Notificaciones Activadas! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recibirás recordatorios automáticos de tus cuotas
              </p>
            </div>
          ) : (
            // Banner de activación
            <>
              <div className="flex items-start gap-3 mb-4">
                {/* Ícono animado */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl animate-ping opacity-20"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bell className="w-7 h-7 text-white animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    🔔 Activa las Notificaciones
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Recibe recordatorios automáticos incluso cuando la app esté cerrada
                  </p>
                </div>
              </div>

              {/* Beneficios */}
              <div className="space-y-2 mb-4 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Recordatorios 7 y 3 días antes del vencimiento</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Confirmación instantánea de pagos recibidos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Alertas de cuotas vencidas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Funciona aunque la app esté cerrada</span>
                </div>
              </div>

              {/* Indicador de app instalada */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                  ✓ App instalada en tu dispositivo
                </span>
              </div>

              {/* Botón de activación */}
              <button
                onClick={handleActivate}
                disabled={isLoading}
                className="w-full btn btn-primary py-3 text-base font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Activando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Bell className="w-5 h-5" />
                    Activar Notificaciones
                  </span>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                Puedes desactivarlas en cualquier momento
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
