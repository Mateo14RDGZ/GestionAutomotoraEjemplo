# Guía de Solución de Problemas PWA en Android

## ✅ Cambios Realizados

### 1. Iconos PWA Generados
- Se crearon iconos SVG en todos los tamaños necesarios (72, 96, 128, 144, 152, 192, 384, 512)
- Los iconos ahora existen en `/frontend/public/`
- SVG es compatible con navegadores modernos y ocupa menos espacio

### 2. Manifest.json Actualizado
- ✅ `scope` y `prefer_related_applications` añadidos
- ✅ Iconos actualizados con referencias correctas
- ✅ Al menos un ícono de 192x192 y otro de 512x512 (requeridos por Android)
- ✅ `purpose: "maskable"` para iconos adaptativos de Android

### 3. Service Worker Mejorado
- ✅ Versión actualizada (v7)
- ✅ Manejo de errores mejorado al cachear assets
- ✅ Lista completa de iconos en caché

## 🔍 Requisitos para PWA en Android

Para que aparezca la opción "Agregar a pantalla de inicio" o "Instalar app", debes cumplir:

### ✅ Requisitos Técnicos
1. **HTTPS Obligatorio** ⚠️ CRÍTICO
   - La app DEBE servirse sobre HTTPS (no HTTP)
   - Vercel automáticamente provee HTTPS
   - Localhost funciona en desarrollo
   
2. **Manifest válido**
   - ✅ Ya configurado correctamente
   
3. **Service Worker registrado**
   - ✅ Ya implementado en `usePWA.js`
   
4. **Iconos requeridos**
   - ✅ Al menos 192x192 y 512x512

### 🔍 Cómo Verificar en Android

#### Chrome DevTools (Desktop)
1. Abre tu sitio en Chrome
2. F12 → Application → Manifest
3. Verifica que no haya errores
4. Application → Service Workers → Verifica que esté "activated and running"

#### En el Dispositivo Android
1. Abre Chrome en Android
2. Ve a tu sitio: `https://tu-dominio-vercel.app`
3. Menú (⋮) → "Agregar a pantalla de inicio" o "Instalar app"

## ⚠️ Problemas Comunes

### El botón no aparece en Android

**Causa #1: No estás usando HTTPS**
```
❌ http://tu-sitio.com  
✅ https://tu-sitio.com
```
**Solución**: Asegúrate de acceder con HTTPS

**Causa #2: Ya instalaste la app antes**
- Android no muestra el prompt si ya está instalada
- Desinstala la app desde Configuración → Apps
- Limpia datos de Chrome
- Vuelve a visitar el sitio

**Causa #3: Chrome no detecta que es instalable**
- Abre Chrome DevTools en desktop
- Ve a Application → Manifest
- Busca warnings o errores
- Verifica que Service Worker esté activo

**Causa #4: Navegador diferente**
- Samsung Internet, Firefox no siempre soportan PWA igual
- Usa Chrome/Edge para mejor compatibilidad

### Verificar Service Worker

En la consola de Chrome (Android):
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW registrados:', registrations.length);
  registrations.forEach(r => console.log(r.scope));
});
```

## 🚀 Desplegar Cambios

### Opción 1: Desarrollo Local
```bash
cd frontend
npm run dev
```
Accede desde tu Android en la misma red: `http://TU-IP:5173`
⚠️ **Nota**: En desarrollo HTTP, PWA tiene limitaciones

### Opción 2: Producción (Vercel)
```bash
# Hacer commit y push
git add .
git commit -m "fix: corregir PWA para Android"
git push origin main

# Vercel desplegará automáticamente
# Accede desde Android: https://tu-app.vercel.app
```

## 📱 Instrucciones para el Usuario Final

### En Chrome Android:
1. Abre `https://tu-sitio.vercel.app`
2. Espera a que cargue completamente
3. Toca el menú (⋮) arriba a la derecha
4. Busca "Agregar a pantalla de inicio" o "Instalar app"
5. Confirma la instalación

### Banner Automático (si está configurado):
- Puede aparecer un banner automático al visitar
- Solo aparece si cumples TODOS los requisitos
- El usuario debe interactuar con el sitio primero

## 🔧 Testing Checklist

Antes de probar en Android:

- [ ] App desplegada en Vercel (HTTPS)
- [ ] Service Worker sin errores en DevTools
- [ ] Manifest sin warnings en DevTools
- [ ] Iconos cargando correctamente
- [ ] No hay errores de consola relacionados con PWA
- [ ] La app no está ya instalada en el dispositivo

## 🐛 Debug Avanzado

### Lighthouse PWA Audit
1. Chrome DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Click "Generate report"
4. Revisa qué criterios fallan

### Chrome Flags (para testing)
En Chrome Android:
- `chrome://flags/#bypass-app-banner-engagement-checks`
- Habilítalo para testing (no para producción)

## 📞 Soporte

Si después de aplicar estos cambios y verificar HTTPS sigue sin funcionar:

1. Comparte el URL de tu app en producción
2. Abre Chrome DevTools → Application → Manifest
3. Captura pantalla de errores si los hay
4. Verifica Chrome version en Android (debe ser 80+)

---

**Última actualización**: Diciembre 2025
**Versión SW**: v7.0.0
**Versión Manifest**: 2.0 (con scope y prefer_related_applications)
