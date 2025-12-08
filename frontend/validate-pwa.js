// Script para validar configuración PWA
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validando configuración PWA...\n');

let errors = 0;
let warnings = 0;

// 1. Verificar manifest.json
console.log('📄 Verificando manifest.json...');
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Validar campos requeridos
    const required = ['name', 'short_name', 'start_url', 'display', 'icons'];
    required.forEach(field => {
      if (!manifest[field]) {
        console.error(`  ❌ Falta campo requerido: ${field}`);
        errors++;
      }
    });
    
    // Validar iconos
    if (manifest.icons && manifest.icons.length > 0) {
      const has192 = manifest.icons.some(i => i.sizes.includes('192'));
      const has512 = manifest.icons.some(i => i.sizes.includes('512'));
      
      if (!has192) {
        console.error('  ❌ Falta ícono de 192x192 (requerido para Android)');
        errors++;
      } else {
        console.log('  ✅ Ícono 192x192 presente');
      }
      
      if (!has512) {
        console.error('  ❌ Falta ícono de 512x512 (requerido para Android)');
        errors++;
      } else {
        console.log('  ✅ Ícono 512x512 presente');
      }
      
      // Verificar que los iconos existen
      manifest.icons.forEach(icon => {
        const iconPath = path.join(__dirname, 'public', icon.src.split('?')[0]);
        if (!fs.existsSync(iconPath)) {
          console.warn(`  ⚠️  Ícono no encontrado: ${icon.src}`);
          warnings++;
        }
      });
    } else {
      console.error('  ❌ No hay iconos definidos');
      errors++;
    }
    
    // Verificar campos opcionales pero recomendados
    if (!manifest.theme_color) {
      console.warn('  ⚠️  Se recomienda definir theme_color');
      warnings++;
    }
    
    if (!manifest.background_color) {
      console.warn('  ⚠️  Se recomienda definir background_color');
      warnings++;
    }
    
    console.log('  ✅ manifest.json válido');
  } catch (e) {
    console.error(`  ❌ Error al parsear manifest.json: ${e.message}`);
    errors++;
  }
} else {
  console.error('  ❌ manifest.json no encontrado');
  errors++;
}

// 2. Verificar Service Worker
console.log('\n⚙️  Verificando Service Worker...');
const swPath = path.join(__dirname, 'public', 'sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  if (!swContent.includes('install')) {
    console.error('  ❌ Service Worker no tiene evento install');
    errors++;
  }
  
  if (!swContent.includes('activate')) {
    console.error('  ❌ Service Worker no tiene evento activate');
    errors++;
  }
  
  if (!swContent.includes('fetch')) {
    console.warn('  ⚠️  Service Worker no maneja evento fetch (offline no funcionará)');
    warnings++;
  }
  
  console.log('  ✅ sw.js presente y válido');
} else {
  console.error('  ❌ sw.js no encontrado');
  errors++;
}

// 3. Verificar index.html
console.log('\n📝 Verificando index.html...');
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (!indexContent.includes('manifest.json')) {
    console.error('  ❌ index.html no enlaza manifest.json');
    errors++;
  } else {
    console.log('  ✅ Manifest enlazado');
  }
  
  if (!indexContent.includes('theme-color')) {
    console.warn('  ⚠️  Se recomienda meta tag theme-color');
    warnings++;
  } else {
    console.log('  ✅ Meta theme-color presente');
  }
  
  if (!indexContent.includes('viewport')) {
    console.error('  ❌ Falta meta viewport');
    errors++;
  } else {
    console.log('  ✅ Meta viewport presente');
  }
} else {
  console.error('  ❌ index.html no encontrado');
  errors++;
}

// 4. Verificar iconos en public
console.log('\n🖼️  Verificando iconos en /public...');
const publicDir = path.join(__dirname, 'public');
const icons = fs.readdirSync(publicDir).filter(f => f.startsWith('icon-'));
console.log(`  ℹ️  Encontrados ${icons.length} iconos:`);
icons.forEach(icon => console.log(`     - ${icon}`));

if (icons.length === 0) {
  console.error('  ❌ No se encontraron iconos en /public');
  errors++;
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VALIDACIÓN\n');

if (errors === 0 && warnings === 0) {
  console.log('✅ ¡Configuración PWA perfecta!');
  console.log('✅ La app debería ser instalable en Android');
} else {
  if (errors > 0) {
    console.log(`❌ Errores críticos: ${errors}`);
    console.log('⚠️  Debes corregir los errores para que PWA funcione');
  }
  if (warnings > 0) {
    console.log(`⚠️  Advertencias: ${warnings}`);
    console.log('ℹ️  Las advertencias no impiden la instalación pero mejoran la experiencia');
  }
}

console.log('\n📱 IMPORTANTE PARA ANDROID:');
console.log('   1. La app DEBE servirse sobre HTTPS');
console.log('   2. Vercel automáticamente provee HTTPS');
console.log('   3. Despliega los cambios: git push origin main');
console.log('   4. Accede desde Android: https://tu-app.vercel.app');
console.log('   5. Chrome mostrará opción "Agregar a inicio"');

process.exit(errors > 0 ? 1 : 0);
