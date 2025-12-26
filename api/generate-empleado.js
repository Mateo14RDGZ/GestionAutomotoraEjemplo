const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('\n========================================');
  console.log('USUARIO EMPLEADO - ACCESO LIMITADO');
  console.log('========================================');
  console.log('\nEmail: empleado@demo.com');
  console.log('Password: admin123');
  console.log('Rol: empleado');
  console.log('\nPermisos:');
  console.log('  ✅ Autos (ver, crear, editar, eliminar)');
  console.log('  ✅ Clientes (ver, crear, editar, eliminar)');
  console.log('  ✅ Pagos (ver, registrar, generar cuotas)');
  console.log('  ❌ Dashboard (NO tiene acceso)');
  console.log('  ❌ Reportes (NO tiene acceso)');
  console.log('\nHash generado:');
  console.log(hash);
  console.log('\n\n--- SQL PARA EJECUTAR EN NEON ---\n');
  console.log(`-- Eliminar usuario empleado existente si hay alguno`);
  console.log(`DELETE FROM "Usuario" WHERE email = 'empleado@demo.com';\n`);
  console.log(`-- Crear nuevo usuario empleado`);
  console.log(`INSERT INTO "Usuario" ("email", "password", "rol", "createdAt", "updatedAt")`);
  console.log(`VALUES ('empleado@demo.com', '${hash}', 'empleado', NOW(), NOW());\n`);
  console.log(`-- Verificar`);
  console.log(`SELECT id, email, rol, "createdAt", "updatedAt" FROM "Usuario" WHERE email = 'empleado@demo.com';`);
  console.log('\n========================================\n');
}

generateHash();
