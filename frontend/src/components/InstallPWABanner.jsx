// Componente de banner de instalación PWA
import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, Plus, Menu } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPWABanner = () => {
  const { isInstallable, isInstalled, installApp, isiOS, isAndroid, deferredPrompt } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    console.log('[Banner] Estado:', { isInstallable, isInstalled, isiOS, isAndroid });
    
    // Verificar si el usuario ya rechazó el banner
    const bannerDismissedStr = localStorage.getItem('pwa-banner-dismissed');
    
    if (bannerDismissedStr) {
      const dismissedDate = new Date(bannerDismissedStr);
      const now = new Date();
      
      // Si pasaron los 7 días, limpiar el storage
      if (now > dismissedDate) {
        localStorage.removeItem('pwa-banner-dismissed');
      } else {
        console.log('[Banner] Banner fue rechazado, esperando hasta:', dismissedDate);
        return;
      }
    }
    
    if (isInstallable && !isInstalled) {
      // Mostrar banner después de 2 segundos (reducido para testing)
      const timer = setTimeout(() => {
        console.log('[Banner] Mostrando banner');
        setShowBanner(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isiOS, isAndroid]);

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    // Recordar que el usuario rechazó por 7 días
    const dismissedDate = new Date();
    dismissedDate.setDate(dismissedDate.getDate() + 7);
    localStorage.setItem('pwa-banner-dismissed', dismissedDate.toISOString());
  };

  if (!showBanner || dismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-4 md:max-w-md z-[9999] animate-fadeInUp">
      <div className="relative bg-white dark:bg-gray-800 md:rounded-2xl shadow-2xl border-t-4 md:border-t-0 md:border border-primary-500 dark:border-primary-600 overflow-hidden backdrop-blur-xl">
        {/* Fondo decorativo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-purple-50/30 dark:from-primary-900/20 dark:via-gray-800 dark:to-purple-900/10 pointer-events-none"></div>
        
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Botón cerrar mejorado */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-sm"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative p-5 md:p-6">
          {/* Header con ícono animado */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative flex-shrink-0">
              {/* Círculo de pulso en el fondo */}
              <div className="absolute inset-0 bg-primary-500 rounded-2xl animate-ping opacity-20"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 hover:rotate-3">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pr-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                Instala RV Autos
                <span className="inline-block px-2 py-0.5 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  Gratis
                </span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acceso rápido • Sin ocupar espacio • Siempre actualizada
              </p>
            </div>
          </div>

          {/* Contenido según plataforma */}
          {isiOS ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-3">
                <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2 text-sm">
                  <Share className="w-4 h-4" />
                  Cómo instalar en iPhone/iPad
                </p>
                
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Toca el botón <strong className="text-blue-600 dark:text-blue-400">Compartir</strong>
                        <Share className="inline w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
                        en la barra inferior
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Selecciona <strong className="text-blue-600 dark:text-blue-400">Añadir a pantalla de inicio</strong>
                        <Plus className="inline w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Toca <strong className="text-blue-600 dark:text-blue-400">Añadir</strong> y ¡listo!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Aparecerá como una app en tu pantalla de inicio</span>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-3">
              <button
                onClick={handleInstall}
                className="w-full btn btn-primary group relative overflow-hidden py-3.5 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Instalar Aplicación
                </span>
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-bold">✓</div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Gratis</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-bold">✓</div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Rápida</div>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-bold">✓</div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Segura</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-3">
                <p className="font-semibold text-green-900 dark:text-green-300 flex items-center gap-2 text-sm">
                  <Menu className="w-4 h-4" />
                  Cómo instalar en Android
                </p>
                
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Toca el menú <strong className="text-green-600 dark:text-green-400">⋮</strong> en la esquina superior
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Selecciona <strong className="text-green-600 dark:text-green-400">Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Confirma y <strong className="text-green-600 dark:text-green-400">¡disfruta!</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Se instalará como una app nativa en tu dispositivo</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPWABanner;
