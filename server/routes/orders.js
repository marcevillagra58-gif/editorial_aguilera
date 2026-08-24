// server/routes/orders.js
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración del transporter Nodemailer con Zoho Mail / SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtppro.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // 465 SSL
  auth: {
    user: process.env.SMTP_USER || 'ventas@editorialaguilera.com.ar',
    pass: process.env.SMTP_PASS || '',
  },
});

router.post('/', async (req, res) => {
  try {
    const { cliente, items, total } = req.body;

    if (!cliente || !cliente.nombre || !cliente.email || !cliente.telefono || !items || !items.length) {
      return res.status(400).json({ error: 'Datos incompletos para procesar la orden' });
    }

    const fechaStr = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    // 1. Formatear lista de items para email HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.titulo}</strong><br/>
          <span style="color: #666; font-size: 13px;">${item.autor}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.precio * item.qty).toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    const totalFormatted = `$${total.toLocaleString('es-AR')}`;

    // 2. Email para la Editorial (ventas@editorialaguilera.com.ar)
    const mailToVentas = {
      from: `"Editorial Aguilera - Tienda" <${process.env.SMTP_USER || 'ventas@editorialaguilera.com.ar'}>`,
      to: 'ventas@editorialaguilera.com.ar',
      subject: `🛒 Nuevo Pedido Web de ${cliente.nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d1b2a; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; color: #d4af37;">Nuevo Pedido Web Recibido</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Editorial Aguilera</p>
          </div>
          <div style="padding: 20px; background-color: #ffffff; color: #333333;">
            <h3 style="border-bottom: 2px solid #d4af37; padding-bottom: 5px; color: #0d1b2a;">Datos del Comprador</h3>
            <p><strong>Nombre y Apellido:</strong> ${cliente.nombre}</p>
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Teléfono / WhatsApp:</strong> ${cliente.telefono}</p>
            ${cliente.direccion ? `<p><strong>Dirección / Localidad:</strong> ${cliente.direccion}</p>` : ''}
            ${cliente.notas ? `<p><strong>Notas adicionales:</strong> ${cliente.notas}</p>` : ''}
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
      `
    };

    // 3. Email de Confirmación para el Comprador
    const mailToCliente = {
      from: `"Editorial Aguilera" <${process.env.SMTP_USER || 'ventas@editorialaguilera.com.ar'}>`,
      to: cliente.email,
      subject: `📚 Confirmación de Pedido - Editorial Aguilera`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d1b2a; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; color: #d4af37;">¡Gracias por tu pedido, ${cliente.nombre}!</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Editorial Aguilera - Tu editorial jurídica de confianza</p>
          </div>
          <div style="padding: 20px; background-color: #ffffff; color: #333333;">
            <p>Hemos recibido correctamente tu solicitud de compra. Un representante de ventas se pondrá en contacto a la brevedad para coordinar la forma de pago y el envío de tu pedido.</p>

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
      `
    };

    // Intentar enviar emails si la clave SMTP está provista, sino responder exitoso para no bloquear al usuario
    if (process.env.SMTP_PASS) {
      await Promise.all([
        transporter.sendMail(mailToVentas),
        transporter.sendMail(mailToCliente)
      ]);
      console.log(`✅ Emails de pedido enviados a ventas@editorialaguilera.com.ar y a ${cliente.email}`);
    } else {
      console.log(`⚠️ SMTP_PASS no configurado. Simulación exitosa de pedido de ${cliente.nombre} (${cliente.email})`);
    }

    return res.status(200).json({ success: true, message: 'Pedido recibido con éxito' });
  } catch (error) {
    console.error('❌ Error al procesar pedido:', error);
    return res.status(500).json({ error: 'No se pudo procesar la solicitud de pedido' });
  }
});

export default router;
