const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');
const prisma = require('../lib/prisma');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Solo admin puede gestionar clientes
router.use(isAdmin);

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const { buscar, incluirInactivos } = req.query;
    
    const where = {
      // Por defecto, solo mostrar clientes activos (no archivados)
      activo: incluirInactivos === 'true' ? undefined : true
    };
    
    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { cedula: { contains: buscar, mode: 'insensitive' } },
        { telefono: { contains: buscar, mode: 'insensitive' } },
        { email: { contains: buscar, mode: 'insensitive' } },
      ];
    }

    const clientes = await prisma.cliente.findMany({
      where,
      include: {
        autos: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            matricula: true,
            estado: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: {
        autos: {
          include: {
            pagos: true
          }
        }
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, cedula, telefono, direccion, email } = req.body;

    console.log('📝 Creando cliente:', { nombre, cedula, telefono, email });

    // Validar campos obligatorios
    if (!nombre || !cedula || !telefono) {
      return res.status(400).json({ error: 'Nombre, cédula y teléfono son obligatorios' });
    }

    // Verificar si la cédula ya existe
    const existingCliente = await prisma.cliente.findUnique({
      where: { cedula }
    });

    if (existingCliente) {
      return res.status(400).json({ error: 'La cédula ya está registrada' });
    }

    // Si se proporciona email, verificar que no exista
    if (email) {
      const existingEmail = await prisma.cliente.findFirst({
        where: { email }
      });

      if (existingEmail) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    // Crear cliente y opcionalmente usuario en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear cliente
      const cliente = await tx.cliente.create({
        data: {
          nombre,
          cedula,
          telefono,
          direccion: direccion || null,
          email: email || null,
        }
      });

      let passwordCliente = null;

      // Solo crear usuario si se proporciona email
      if (email) {
        // Crear usuario con contraseña = últimos 4 dígitos de cédula
        passwordCliente = cedula.slice(-4);
        const hashedPassword = await bcrypt.hash(passwordCliente, 10);
        
        await tx.usuario.create({
          data: {
            email,
            password: hashedPassword,
            rol: 'cliente',
            clienteId: cliente.id,
          }
        });
      }

      return { cliente, passwordCliente };
    });

    console.log('✅ Cliente creado:', result.cliente.id);

    const response = {
      ...result.cliente,
    };

    if (result.passwordCliente) {
      response.passwordTemporal = result.passwordCliente;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Error al crear cliente:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al crear cliente',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, telefono, direccion, email } = req.body;

    console.log('📝 Actualizando cliente:', id, { nombre, cedula, telefono, email });

    // Verificar si el cliente existe
    const existingCliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Si se cambia la cédula, verificar que no exista
    if (cedula && cedula !== existingCliente.cedula) {
      const cedulaExists = await prisma.cliente.findUnique({
        where: { cedula }
      });
      if (cedulaExists) {
        return res.status(400).json({ error: 'La cédula ya está registrada' });
      }
    }

    // Si se proporciona email y es diferente, verificar que no exista
    if (email && email !== existingCliente.email) {
      const emailExists = await prisma.cliente.findFirst({
        where: { 
          email,
          id: { not: parseInt(id) }
        }
      });
      if (emailExists) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        cedula,
        telefono,
        direccion: direccion || null,
        email: email || null,
      }
    });

    console.log('✅ Cliente actualizado:', cliente.id);

    res.json(cliente);
  } catch (error) {
    console.error('❌ Error al actualizar cliente:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al actualizar cliente',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: {
        autos: true
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Si tiene autos asociados, no permitir eliminación directa
    if (cliente.autos.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar un cliente con autos asociados. Elimine o reasigne los autos primero.' 
      });
    }

    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
