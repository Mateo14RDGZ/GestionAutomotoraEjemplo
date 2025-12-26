# Sistema de Roles - Usuario Empleado

## 📋 Resumen

Se ha implementado un nuevo rol de usuario **"empleado"** que tiene acceso limitado al sistema. Los empleados pueden realizar todas las funciones administrativas excepto ver información financiera y reportes.

## 👥 Roles Disponibles

### 1. **Admin** (Administrador)
- ✅ Acceso completo a todas las funcionalidades
- ✅ Dashboard con estadísticas financieras
- ✅ Gestión de Autos, Clientes y Pagos
- ✅ Reportes y análisis
- ✅ Permutas

### 2. **Empleado** (Nuevo)
- ✅ Gestión de Autos (crear, editar, eliminar, ver)
- ✅ Gestión de Clientes (crear, editar, eliminar, ver)
- ✅ Gestión de Pagos (ver, registrar, generar cuotas)
- ✅ Permutas (ver, crear, editar)
- ❌ Dashboard (información financiera)
- ❌ Reportes

### 3. **Cliente**
- ✅ Ver su propio dashboard
- ✅ Ver sus cuotas y pagos
- ❌ No puede acceder a funciones administrativas

## 🔐 Credenciales del Empleado

```
Email: empleado@demo.com
Password: admin123
```

## 🚀 Cómo Crear el Usuario Empleado

### Paso 1: Generar el Hash (Opcional)
Si necesitas regenerar el hash de la contraseña:

```bash
cd api
node generate-empleado.js
```

### Paso 2: Ejecutar SQL en Neon

Ejecuta los siguientes comandos SQL en tu consola de Neon:

```sql
-- Eliminar usuario empleado existente si hay alguno
DELETE FROM "Usuario" WHERE email = 'empleado@demo.com';

-- Crear nuevo usuario empleado
INSERT INTO "Usuario" ("email", "password", "rol")
VALUES ('empleado@demo.com', '$2a$10$OJNATC1ejhsCN33f.zsS.uwbLrACJ.8upfC6eho14qs7AZ7vbO9m2', 'empleado');

-- Verificar
SELECT id, email, rol FROM "Usuario" WHERE email = 'empleado@demo.com';
```

## 📝 Cambios Técnicos Realizados

### Backend (API)

1. **Schema de Prisma** (`api/prisma/schema.prisma`)
   - Actualizado el comentario del campo `rol` para incluir "empleado"

2. **Middleware de Autenticación** (`api/lib/auth.js`)
   - Agregado nuevo middleware `isStaff` que permite acceso a admin y empleado

3. **Rutas de la API** (`api/index.js`)
   - Se mantiene `requireAdmin` solo para `/api/dashboard/stats`
   - Se usa `requireStaff` para todas las demás rutas (autos, clientes, pagos, permutas)

4. **Script de Generación** (`api/generate-empleado.js`)
   - Nuevo script para generar el hash y SQL del usuario empleado

### Frontend

1. **Layout** (`frontend/src/components/Layout.jsx`)
   - Menú adaptado según el rol del usuario
   - Empleados ven: Autos, Clientes, Pagos
   - Empleados NO ven: Dashboard, Reportes

2. **Rutas** (`frontend/src/App.jsx`)
   - Agregado componente `AdminOnlyRoute` para proteger rutas exclusivas de admin
   - Dashboard y Reportes protegidas con `AdminOnlyRoute`

3. **Redirección por Rol** (`frontend/src/components/RoleBasedRedirect.jsx`)
   - Empleados son redirigidos a `/autos` al iniciar sesión
   - Admins van a `/dashboard`
   - Clientes van a `/mi-dashboard`

4. **Componente de Protección** (`frontend/src/components/AdminOnlyRoute.jsx`)
   - Nuevo componente que restringe acceso solo a administradores

## 🔄 Flujo de Trabajo

### Inicio de Sesión como Empleado
1. Usuario ingresa: `empleado@demo.com` / `admin123`
2. Sistema autentica y asigna rol "empleado"
3. Usuario es redirigido a `/autos`
4. Menú muestra solo: Autos, Clientes, Pagos

### Intento de Acceso No Autorizado
- Si un empleado intenta acceder a `/dashboard` o `/reportes`:
  - Frontend: Redirige automáticamente a `/autos`
  - Backend: Retorna error 403 si intenta acceder a la API

## 🎨 Interfaz de Usuario

### Menú del Empleado
```
🚗 Gestión Automotora
├── 🚗 Autos
├── 👥 Clientes
└── 💳 Pagos
```

### Perfil Mostrado
```
empleado@demo.com
Empleado
```

## ⚠️ Importante

- **Seguridad**: El hash de contraseña mostrado arriba es específico para esta instalación
- **Regeneración**: Si cambias la contraseña, debes ejecutar `generate-empleado.js` nuevamente
- **Base de Datos**: Asegúrate de ejecutar el SQL en tu base de datos de Neon
- **Testing**: Prueba todas las funcionalidades con el usuario empleado antes de producción

## 🧪 Testing

Para probar el sistema de roles:

1. **Login como Empleado**: Verifica que solo veas Autos, Clientes y Pagos
2. **Intenta acceder a Dashboard**: Debe redirigir automáticamente
3. **Prueba crear un Auto**: Debe funcionar correctamente
4. **Prueba registrar un Pago**: Debe funcionar correctamente
5. **Verifica el menú**: No debe mostrar Dashboard ni Reportes

## 📚 Documentación Adicional

- [Prisma Schema](api/prisma/schema.prisma)
- [Middleware de Autenticación](api/lib/auth.js)
- [Rutas del Frontend](frontend/src/App.jsx)
- [Layout Adaptativo](frontend/src/components/Layout.jsx)
