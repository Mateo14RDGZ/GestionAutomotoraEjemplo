// Script para generar favicon.ico desde faviconRF.jpg
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceImage = path.join(__dirname, 'public', 'assets', 'faviconRF.jpg');
const outputIco = path.join(__dirname, 'public', 'favicon.ico');

console.log('🔧 Generando favicon.ico...\n');

// Generar favicon.ico (formato PNG con extensión .ico, tamaño 32x32)
// Nota: Sharp no genera archivos .ico nativos, pero muchos navegadores aceptan PNG renombrados
async function generateFaviconIco() {
  try {
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 100
      })
      .toFile(outputIco);
    
    console.log('✅ favicon.ico generado');
    console.log('📝 Nota: Es un PNG de 32x32 con extensión .ico (compatible con la mayoría de navegadores)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateFaviconIco();
