// Script para generar iconos PWA básicos usando Canvas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear un ícono SVG simple
const createSimpleSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo azul -->
  <rect width="${size}" height="${size}" fill="#1890cf" rx="${size * 0.15}"/>
  
  <!-- Letras RV en blanco -->
  <text x="50%" y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.4}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central">RV</text>
  
  <!-- Subtítulo pequeño -->
  <text x="50%" y="${size * 0.75}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        fill="white" 
        text-anchor="middle" 
        opacity="0.9">AUTOS</text>
</svg>`;
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, 'public');

// Crear directorio public si no existe
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generar iconos SVG para cada tamaño
sizes.forEach(size => {
  const svg = createSimpleSVG(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svg, 'utf8');
  console.log(`✓ Generado: ${filename}`);
});

// Crear también un favicon
const faviconSVG = createSimpleSVG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG, 'utf8');
console.log('✓ Generado: favicon.svg');

console.log('\n✅ Iconos SVG generados exitosamente!');
console.log('📝 Nota: Los navegadores modernos soportan SVG como iconos PWA.');
console.log('   Si necesitas PNG, puedes convertirlos con herramientas online.');
