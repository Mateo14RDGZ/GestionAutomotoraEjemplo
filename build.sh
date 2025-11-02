#!/bin/bash
# Build script para Vercel

echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install

echo "🏗️  Construyendo frontend..."
npm run build

echo "📦 Instalando dependencias del backend..."
cd ../backend
npm install

echo "🔨 Generando Prisma Client..."
npx prisma generate

echo "✅ Build completado!"
