import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'public', 'assets', 'logo-rv.png');
const outputDir = path.join(__dirname, 'public');

async function generateIcons() {
  console.log('🎨 Generando íconos PWA desde logo-rv.png...\n');

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}.png`);
    
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✅ Generado: icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 ¡Íconos generados exitosamente!');
}

generateIcons().catch(console.error);
