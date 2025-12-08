// Script para generar iconos PWA a partir de faviconRF.jpg
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tamaños requeridos para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Rutas
const sourceImage = path.join(__dirname, 'public', 'assets', 'faviconRF.jpg');
const outputDir = path.join(__dirname, 'public');

console.log('🖼️  Generando iconos PWA desde faviconRF.jpg...\n');

// Verificar que la imagen fuente existe
if (!fs.existsSync(sourceImage)) {
  console.error('❌ Error: No se encontró faviconRF.jpg en public/assets/');
  process.exit(1);
}

// Función para generar un ícono
async function generateIcon(size) {
  try {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    
    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(outputPath);
    
    console.log(`✅ Generado: icon-${size}.png`);
    return true;
  } catch (error) {
    console.error(`❌ Error generando icon-${size}.png:`, error.message);
    return false;
  }
}

// Generar favicon.ico (32x32)
async function generateFavicon() {
  try {
    const faviconPath = path.join(outputDir, 'favicon.png');
    
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 100
      })
      .toFile(faviconPath);
    
    console.log('✅ Generado: favicon.png');
    return true;
  } catch (error) {
    console.error('❌ Error generando favicon.png:', error.message);
    return false;
  }
}

// Generar apple-touch-icon (180x180)
async function generateAppleIcon() {
  try {
    const applePath = path.join(outputDir, 'apple-touch-icon.png');
    
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 100
      })
      .toFile(applePath);
    
    console.log('✅ Generado: apple-touch-icon.png');
    return true;
  } catch (error) {
    console.error('❌ Error generando apple-touch-icon.png:', error.message);
    return false;
  }
}

// Ejecutar generación
(async () => {
  try {
    // Generar todos los iconos PWA
    console.log('📱 Generando iconos PWA...');
    const results = await Promise.all(sizes.map(size => generateIcon(size)));
    
    // Generar favicon
    console.log('\n🌐 Generando favicon...');
    await generateFavicon();
    
    // Generar Apple Touch Icon
    console.log('\n🍎 Generando Apple Touch Icon...');
    await generateAppleIcon();
    
    const successCount = results.filter(r => r).length;
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Completado: ${successCount}/${sizes.length} iconos PWA generados`);
    console.log('✅ favicon.png generado');
    console.log('✅ apple-touch-icon.png generado');
    console.log('\n💡 Recuerda actualizar manifest.json si es necesario');
    console.log('💡 Los iconos están en formato PNG optimizado');
    
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    process.exit(1);
  }
})();
