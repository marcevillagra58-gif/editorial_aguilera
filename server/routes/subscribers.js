// server/routes/subscribers.js
import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/subscribers — Suscribirse al newsletter (público)
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' });
  }
  try {
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.activo) {
        return res.status(409).json({ message: 'Este email ya está suscripto' });
      } else {
        // Reactivar suscripción
        existing.activo = true;
        await existing.save();
        return res.json({ message: '¡Suscripción reactivada con éxito!' });
      }
    }
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: '¡Te suscribiste con éxito!' });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la suscripción', error: error.message });
  }
});

// GET /api/subscribers — Listar todos los suscriptores (solo admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ activo: true }).sort({ fechaSuscripcion: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener suscriptores', error: error.message });
  }
});

// DELETE /api/subscribers/:id — Dar de baja (solo admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Subscriber.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ message: 'Suscriptor dado de baja' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja', error: error.message });
  }
});

export default router;
