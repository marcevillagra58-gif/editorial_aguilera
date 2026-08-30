// server/routes/orders.js
import express from 'express';
import { Resend } from 'resend';
import Order from '../models/Order.js';

const router = express.Router();

// Middleware de autenticación de admin
const requireAdmin = (req, res, next) => {
  const adminPass = req.headers['x-admin-password'];
  if (!adminPass || adminPass !== (process.env.ADMIN_PASSWORD || 'Acasusso2072')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  next();
};

// POST /api/orders — Crear nuevo pedido y guardar en MongoDB + enviar emails
router.post('/', async (req, res) => {
  try {
    const { cliente, items, total } = req.body;

    if (!cliente || !cliente.nombre || !cliente.email || !cliente.telefono || !items || !items.length) {
      return res.status(400).json({ error: 'Datos incompletos para procesar la orden' });
    }

    // 1. Guardar orden en MongoDB
    const nuevaOrden = new Order({
      cliente: {
        nombre: cliente.nombre.trim(),
        email: cliente.email.trim().toLowerCase(),
        telefono: cliente.telefono.trim(),
        direccion: cliente.direccion ? cliente.direccion.trim() : '',
        notas: cliente.notas ? cliente.notas.trim() : ''
      },
      items: items.map(it => ({
        id: it.id,
        titulo: it.titulo,
        autor: it.autor || '',
        precio: Number(it.precio),
        qty: Number(it.qty) || 1,
        portada: it.portada || '',
        materia: it.materia || ''
      })),
      total: Number(total) || 0,
      estado: 'pendiente'
    });

    const ordenGuardada = await nuevaOrden.save();
    console.log(`📦 Nueva orden guardada en MongoDB con ID: ${ordenGuardada._id}`);

    // 2. Enviar emails vía Resend si la API Key está configurada
    const apiKey = process.env.RESEND_API_KEY;
    const fechaStr = new Date(ordenGuardada.createdAt).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const fromEmail = process.env.EMAIL_FROM || 'Editorial Aguilera <contacto@editorialaguilera.com.ar>';
        const totalFormatted = `$${ordenGuardada.total.toLocaleString('es-AR')}`;

        const itemsHtml = ordenGuardada.items.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>${item.titulo}</strong><br/>
              <span style="color: #666; font-size: 13px;">${item.autor}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.precio * item.qty).toLocaleString('es-AR')}</td>
          </tr>
        `).join('');

        // Email para Ventas
        const orderHtmlForAdmin = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0d1b2a; padding: 20px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; color: #d4af37;">Nuevo Pedido Web Recibido (#${ordenGuardada._id.toString().slice(-6).toUpperCase()})</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Editorial Aguilera</p>
            </div>
            <div style="padding: 20px; background-color: #ffffff; color: #333333;">
              <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px; color: #0d1b2a;">Datos del Comprador</h3>
              <p><strong>Nombre y Apellido:</strong> ${ordenGuardada.cliente.nombre}</p>
              <p><strong>Email:</strong> ${ordenGuardada.cliente.email}</p>
              <p><strong>Teléfono / WhatsApp:</strong> ${ordenGuardada.cliente.telefono}</p>
              ${ordenGuardada.cliente.direccion ? `<p><strong>Dirección / Localidad:</strong> ${ordenGuardada.cliente.direccion}</p>` : ''}
              ${ordenGuardada.cliente.notas ? `<p><strong>Notas adicionales:</strong> ${ordenGuardada.cliente.notas}</p>` : ''}
              <p style="font-size: 12px; color: #888;">Fecha de pedido: ${fechaStr}</p>

              <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px; color: #0d1b2a; margin-top: 25px;">Detalle del Pedido</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #f8f9fa; text-align: left;">
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Libro</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Cant.</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              <div style="text-align: right; margin-top: 15px; font-size: 18px; color: #0d1b2a;">
                <strong>Total Estimado: ${totalFormatted}</strong>
              </div>
            </div>
          </div>
        `;

        // Email para Cliente
        const orderHtmlForCustomer = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0d1b2a; padding: 20px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; color: #d4af37;">¡Gracias por tu pedido, ${ordenGuardada.cliente.nombre}!</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Editorial Aguilera - Tu editorial jurídica de confianza</p>
            </div>
            <div style="padding: 20px; background-color: #ffffff; color: #333333;">
              <p>Hemos recibido correctamente tu solicitud de compra (Pedido <strong>#${ordenGuardada._id.toString().slice(-6).toUpperCase()}</strong>). Un representante de ventas se pondrá en contacto a la brevedad para coordinar la forma de pago y el envío.</p>

              <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px; color: #0d1b2a; margin-top: 20px;">Resumen de tu solicitud</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #f8f9fa; text-align: left;">
                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Libro</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Cant.</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              <div style="text-align: right; margin-top: 15px; font-size: 18px; color: #0d1b2a;">
                <strong>Total Estimado: ${totalFormatted}</strong>
              </div>
              <p style="font-size: 13px; color: #666; margin-top: 20px;">* Los precios están sujetos a modificaciones y el costo de envío se acuerda según la localidad.</p>

              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 25px; text-align: center; font-size: 13px; color: #555;">
                <p style="margin: 0;">Si tenés alguna duda o consulta, podés responder directamente a este correo o escribirnos a <a href="mailto:contacto@editorialaguilera.com.ar" style="color: #d4af37;">contacto@editorialaguilera.com.ar</a>.</p>
              </div>
            </div>
          </div>
        `;

        const [resAdmin, resClient] = await Promise.allSettled([
          resend.emails.send({
            from: fromEmail,
            to: ['ventas@editorialaguilera.com.ar'],
            replyTo: ordenGuardada.cliente.email,
            subject: `🛒 Nuevo Pedido Web #${ordenGuardada._id.toString().slice(-6).toUpperCase()} de ${ordenGuardada.cliente.nombre}`,
            html: orderHtmlForAdmin,
          }),
          resend.emails.send({
            from: fromEmail,
            to: [ordenGuardada.cliente.email],
            replyTo: 'contacto@editorialaguilera.com.ar',
            subject: `📚 Confirmación de Pedido #${ordenGuardada._id.toString().slice(-6).toUpperCase()} - Editorial Aguilera`,
            html: orderHtmlForCustomer,
          })
        ]);

        if (resAdmin.status === 'fulfilled' && !resAdmin.value.error) {
          ordenGuardada.emailSentToVentas = true;
        }
        if (resClient.status === 'fulfilled' && !resClient.value.error) {
          ordenGuardada.emailSentToCliente = true;
        }
        await ordenGuardada.save();
      } catch (errEmail) {
        console.warn('⚠️ Error al enviar emails vía Resend:', errEmail.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Pedido recibido y registrado con éxito',
      order: ordenGuardada
    });
  } catch (error) {
    console.error('❌ Error al procesar y guardar pedido:', error);
    return res.status(500).json({ error: `Error al procesar pedido: ${error.message}` });
  }
});

// GET /api/orders — Listar pedidos para el panel admin (protegido)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { estado, search } = req.query;
    const filter = {};

    if (estado && estado !== 'todos') {
      filter.estado = estado;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { 'cliente.nombre': searchRegex },
        { 'cliente.email': searchRegex },
        { 'cliente.telefono': searchRegex },
        { 'cliente.direccion': searchRegex },
        { 'items.titulo': searchRegex }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    return res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/orders/stats — Obtener estadísticas consolidadas de ventas y clientes (protegido)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 });

    let totalVentas = 0;
    let totalLibrosVendidos = 0;
    const pedidosPorEstado = {
      pendiente: 0,
      contactado: 0,
      pagado: 0,
      enviado: 0,
      entregado: 0,
      cancelado: 0
    };

    const bookStatsMap = {};
    const clientStatsMap = {};
    const materiaStatsMap = {};

    for (const order of allOrders) {
      // Conteo por estado
      if (pedidosPorEstado[order.estado] !== undefined) {
        pedidosPorEstado[order.estado]++;
      }

      // Solo computar ingresos para órdenes no canceladas
      if (order.estado !== 'cancelado') {
        totalVentas += order.total;

        // Estadísticas de libros
        for (const item of order.items) {
          totalLibrosVendidos += item.qty;
          const bookKey = item.id || item.titulo;

          if (!bookStatsMap[bookKey]) {
            bookStatsMap[bookKey] = {
              id: item.id,
              titulo: item.titulo,
              autor: item.autor || '',
              portada: item.portada || '',
              materia: item.materia || '',
              unidadesVendidas: 0,
              totalFacturado: 0
            };
          }
          bookStatsMap[bookKey].unidadesVendidas += item.qty;
          bookStatsMap[bookKey].totalFacturado += (item.precio * item.qty);

          // Estadísticas por materia
          const materia = item.materia || 'otros';
          if (!materiaStatsMap[materia]) {
            materiaStatsMap[materia] = { materia, unidades: 0, total: 0 };
          }
          materiaStatsMap[materia].unidades += item.qty;
          materiaStatsMap[materia].total += (item.precio * item.qty);
        }

        // Estadísticas de clientes
        const clientEmail = order.cliente.email || 'desconocido';
        if (!clientStatsMap[clientEmail]) {
          clientStatsMap[clientEmail] = {
            nombre: order.cliente.nombre,
            email: order.cliente.email,
            telefono: order.cliente.telefono,
            direccion: order.cliente.direccion || '',
            totalPedidos: 0,
            totalGastado: 0,
            ultimoPedido: order.createdAt
          };
        }
        clientStatsMap[clientEmail].totalPedidos++;
        clientStatsMap[clientEmail].totalGastado += order.total;
        if (new Date(order.createdAt) > new Date(clientStatsMap[clientEmail].ultimoPedido)) {
          clientStatsMap[clientEmail].ultimoPedido = order.createdAt;
        }
      }
    }

    const rankingLibros = Object.values(bookStatsMap).sort((a, b) => b.unidadesVendidas - a.unidadesVendidas);
    const clientesTop = Object.values(clientStatsMap).sort((a, b) => b.totalGastado - a.totalGastado);
    const ventasPorMateria = Object.values(materiaStatsMap).sort((a, b) => b.unidades - a.unidades);

    return res.json({
      totalVentas,
      totalPedidos: allOrders.length,
      pedidosPendientes: pedidosPorEstado.pendiente,
      pedidosPorEstado,
      totalLibrosVendidos,
      totalClientesUnicos: Object.keys(clientStatsMap).length,
      rankingLibros,
      clientesTop,
      ventasPorMateria,
      ultimosPedidos: allOrders.slice(0, 5)
    });
  } catch (error) {
    console.error('❌ Error al calcular estadísticas:', error);
    return res.status(500).json({ error: 'Error al calcular estadísticas de ventas' });
  }
});

// PUT /api/orders/:id — Actualizar estado o notas de un pedido (protegido)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notasAdmin } = req.body;

    const updateData = {};
    if (estado) updateData.estado = estado;
    if (notasAdmin !== undefined) updateData.notasAdmin = notasAdmin;

    const orderUpdated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!orderUpdated) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    return res.json({ success: true, order: orderUpdated });
  } catch (error) {
    console.error('❌ Error al actualizar pedido:', error);
    return res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// DELETE /api/orders/:id — Eliminar un pedido (protegido)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const orderDeleted = await Order.findByIdAndDelete(id);
    if (!orderDeleted) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    return res.json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar pedido:', error);
    return res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

export default router;
