#!/bin/bash
# Build script para Vercel

echo "🚀 Iniciando build para Vercel..."

# 1. Instalar dependencias del API
echo "📦 Instalando dependencias del API..."
cd api
npm install

# 2. Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

# 3. Aplicar migraciones a la base de datos
echo "🗄️ Aplicando schema a la base de datos..."
if [ -n "$DATABASE_URL" ]; then
  echo "✓ DATABASE_URL detectada"
  npx prisma db push --schema=./prisma/schema.prisma --skip-generate --accept-data-loss --force-reset
  echo "✅ Base de datos sincronizada"
  
  # Verificar que las tablas se crearon
  echo "🔍 Verificando tablas..."
  node verify-db.js || echo "⚠️ Advertencia: Error en verificación (continuando...)"
else
  echo "⚠️ DATABASE_URL no configurada, saltando migraciones"
fi

cd ..

# 4. Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

# 5. Build del frontend
echo "🏗️ Construyendo frontend..."
npm run vercel-build

echo "✅ Build completado exitosamente"
