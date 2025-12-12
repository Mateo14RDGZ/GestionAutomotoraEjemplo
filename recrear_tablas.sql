-- Script para recrear todas las tablas en Neon
-- Ejecutar en SQL Editor de Neon Console

-- Eliminar tablas existentes si hay alguna (en orden correcto por dependencias)
DROP TABLE IF EXISTS "Pago" CASCADE;

DROP TABLE IF EXISTS "Auto" CASCADE;

DROP TABLE IF EXISTS "Usuario" CASCADE;

DROP TABLE IF EXISTS "Cliente" CASCADE;

-- Crear tabla Cliente
CREATE TABLE "Cliente" (
    "id" SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla Usuario
CREATE TABLE "Usuario" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "clienteId" INTEGER UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usuario_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Crear tabla Auto
CREATE TABLE "Auto" (
    "id" SERIAL PRIMARY KEY,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "matricula" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'disponible',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "clienteId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Auto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Crear tabla Pago
CREATE TABLE "Pago" (
    "id" SERIAL PRIMARY KEY,
    "autoId" INTEGER NOT NULL,
    "numeroCuota" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pago_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Auto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Crear índices para mejorar rendimiento
CREATE INDEX "Usuario_clienteId_idx" ON "Usuario" ("clienteId");

CREATE INDEX "Auto_clienteId_idx" ON "Auto" ("clienteId");

CREATE INDEX "Pago_autoId_idx" ON "Pago" ("autoId");

-- Crear usuario administrador por defecto
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO
    "Usuario" ("email", "password", "rol")
VALUES (
        'admin@admin.com',
        '$2a$10$5oFZH9vKB6LJqMZQj0YvPOxN8EKr6hxJYc5RGKZj8wYQJZQJ5ZKEW',
        'admin'
    );

-- Mensaje de confirmación
SELECT 'Tablas recreadas exitosamente. Usuario admin: admin@admin.com / admin123' as resultado;