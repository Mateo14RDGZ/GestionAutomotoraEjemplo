const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const admin = require('firebase-admin');
const { authenticateToken } = require('../middleware/auth.middleware');

// Inicializar Firebase Admin (solo una vez)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    console.log('✅ Firebase Admin inicializado');
  } catch (error) {
    console.error('❌ Error al inicializar Firebase Admin:', error);
  }
}

// Suscribir dispositivo a notificaciones
router.post('/suscribir', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;
    const clienteId = req.user.clienteId;

    if (!token) {
      return res.status(400).json({ error: 'Token FCM requerido' });
    }

    // Verificar si el token ya existe
    const existingToken = await prisma.notificationToken.findUnique({
      where: { token }
    });

    if (existingToken) {
      // Actualizar la fecha
      await prisma.notificationToken.update({
        where: { token },
        data: { 
          clienteId,
          updatedAt: new Date()
        }
      });
    } else {
      // Crear nuevo token
      await prisma.notificationToken.create({
        data: {
          token,
          clienteId
        }
      });
    }

    console.log(`✅ Token suscrito para cliente ${clienteId}`);
    res.json({ success: true, message: 'Notificaciones activadas' });
  } catch (error) {
    console.error('Error al suscribir token:', error);
    res.status(500).json({ error: 'Error al activar notificaciones' });
  }
});

// Desuscribir dispositivo
router.post('/desuscribir', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token FCM requerido' });
    }

    await prisma.notificationToken.delete({
      where: { token }
    });

    console.log(`✅ Token desuscrito`);
    res.json({ success: true, message: 'Notificaciones desactivadas' });
  } catch (error) {
    console.error('Error al desuscribir token:', error);
    res.status(500).json({ error: 'Error al desactivar notificaciones' });
  }
});

// Enviar notificación a un cliente específico
async function enviarNotificacionACliente(clienteId, titulo, mensaje, data = {}) {
  try {
    // Obtener todos los tokens del cliente
    const tokens = await prisma.notificationToken.findMany({
      where: { clienteId }
    });

    if (tokens.length === 0) {
      console.log(`⚠️ Cliente ${clienteId} no tiene tokens registrados`);
      return false;
    }

    const tokenList = tokens.map(t => t.token);

    // Preparar el mensaje
    const message = {
      notification: {
        title: titulo,
        body: mensaje,
        icon: '/assets/icon-192.png'
      },
      data: {
        url: data.url || '/',
        ...data
      },
      tokens: tokenList
    };

    // Enviar notificación multicast
    const response = await admin.messaging().sendMulticast(message);
    
    console.log(`✅ Notificación enviada a cliente ${clienteId}:`, response.successCount, 'éxitos,', response.failureCount, 'fallos');

    // Eliminar tokens inválidos
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokenList[idx]);
        }
      });

      // Eliminar tokens inválidos de la base de datos
      await prisma.notificationToken.deleteMany({
        where: {
          token: { in: failedTokens }
        }
      });

      console.log(`🗑️ Eliminados ${failedTokens.length} tokens inválidos`);
    }

    return true;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return false;
  }
}

// Enviar recordatorios automáticos (llamado por cron job)
router.get('/enviar-recordatorios', async (req, res) => {
  try {
    const ahora = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(ahora.getDate() + 7);
    const en3Dias = new Date();
    en3Dias.setDate(ahora.getDate() + 3);

    // Recordatorios 7 días antes
    const pagosEn7Dias = await prisma.pago.findMany({
      where: {
        estado: 'pendiente',
        fechaVencimiento: {
          gte: new Date(en7Dias.setHours(0, 0, 0, 0)),
          lte: new Date(en7Dias.setHours(23, 59, 59, 999))
        }
      },
      include: {
        auto: {
          include: {
            cliente: true
          }
        }
      }
    });

    for (const pago of pagosEn7Dias) {
      await enviarNotificacionACliente(
        pago.auto.clienteId,
        '📅 Recordatorio de Pago - RV Automóviles',
        `Tu cuota #${pago.numeroCuota} vence en 7 días\nMonto: $${pago.monto}`,
        {
          url: '/historial-pagos',
          pagoId: pago.id.toString(),
          tipo: 'recordatorio_7_dias'
        }
      );
    }

    // Recordatorios 3 días antes
    const pagosEn3Dias = await prisma.pago.findMany({
      where: {
        estado: 'pendiente',
        fechaVencimiento: {
          gte: new Date(en3Dias.setHours(0, 0, 0, 0)),
          lte: new Date(en3Dias.setHours(23, 59, 59, 999))
        }
      },
      include: {
        auto: {
          include: {
            cliente: true
          }
        }
      }
    });

    for (const pago of pagosEn3Dias) {
      await enviarNotificacionACliente(
        pago.auto.clienteId,
        '⏰ Recordatorio Importante - RV Automóviles',
        `Tu cuota #${pago.numeroCuota} vence en 3 días\nMonto: $${pago.monto}`,
        {
          url: '/historial-pagos',
          pagoId: pago.id.toString(),
          tipo: 'recordatorio_3_dias',
          requireInteraction: 'true'
        }
      );
    }

    // Alertas de cuotas vencidas hoy
    const pagosVencidosHoy = await prisma.pago.findMany({
      where: {
        estado: 'vencida',
        fechaVencimiento: {
          gte: new Date(ahora.setHours(0, 0, 0, 0)),
          lte: new Date(ahora.setHours(23, 59, 59, 999))
        }
      },
      include: {
        auto: {
          include: {
            cliente: true
          }
        }
      }
    });

    for (const pago of pagosVencidosHoy) {
      await enviarNotificacionACliente(
        pago.auto.clienteId,
        '⚠️ Cuota Vencida - RV Automóviles',
        `Tu cuota #${pago.numeroCuota} venció hoy\nMonto: $${pago.monto}\nPor favor, comunícate con nosotros`,
        {
          url: '/historial-pagos',
          pagoId: pago.id.toString(),
          tipo: 'cuota_vencida',
          requireInteraction: 'true'
        }
      );
    }

    console.log(`✅ Recordatorios enviados: ${pagosEn7Dias.length} (7 días), ${pagosEn3Dias.length} (3 días), ${pagosVencidosHoy.length} (vencidas)`);

    res.json({
      success: true,
      enviados: {
        en7Dias: pagosEn7Dias.length,
        en3Dias: pagosEn3Dias.length,
        vencidas: pagosVencidosHoy.length
      }
    });
  } catch (error) {
    console.error('Error al enviar recordatorios:', error);
    res.status(500).json({ error: 'Error al enviar recordatorios' });
  }
});

// Webhook para notificar pago confirmado (llamar cuando admin marca como pagado)
router.post('/pago-confirmado/:pagoId', authenticateToken, async (req, res) => {
  try {
    const { pagoId } = req.params;

    const pago = await prisma.pago.findUnique({
      where: { id: parseInt(pagoId) },
      include: {
        auto: {
          include: {
            cliente: true
          }
        }
      }
    });

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    await enviarNotificacionACliente(
      pago.auto.clienteId,
      '✅ Pago Confirmado - RV Automóviles',
      `Tu cuota #${pago.numeroCuota} de $${pago.monto} ha sido confirmada.\n¡Gracias por tu pago!`,
      {
        url: '/historial-pagos',
        pagoId: pago.id.toString(),
        tipo: 'pago_confirmado',
        requireInteraction: 'true',
        actions: JSON.stringify([
          { action: 'view', title: 'Ver Comprobante' }
        ])
      }
    );

    res.json({ success: true, message: 'Notificación enviada' });
  } catch (error) {
    console.error('Error al notificar pago confirmado:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});

module.exports = router;
module.exports.enviarNotificacionACliente = enviarNotificacionACliente;
