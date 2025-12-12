const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('\nEmail: admin@demo.com');
  console.log('Password: admin123');
  console.log('\nHash generado:');
  console.log(hash);
  console.log('\n\n--- SQL PARA EJECUTAR EN NEON ---\n');
  console.log(`-- Eliminar usuario admin existente si hay alguno`);
  console.log(`DELETE FROM "Usuario" WHERE email = 'admin@demo.com';\n`);
  console.log(`-- Crear nuevo usuario admin`);
  console.log(`INSERT INTO "Usuario" ("email", "password", "rol")`);
  console.log(`VALUES ('admin@demo.com', '${hash}', 'admin');\n`);
  console.log(`-- Verificar`);
  console.log(`SELECT id, email, rol FROM "Usuario" WHERE email = 'admin@demo.com';`);
}

generateHash();
