import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  titulo: { type: String, required: true },
  autor: { type: String },
  precio: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  portada: { type: String },
  materia: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  cliente: {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    direccion: { type: String, trim: true },
    notas: { type: String, trim: true }
  },
  items: [orderItemSchema],
  total: { type: Number, required: true, min: 0 },
  estado: {
    type: String,
    enum: ['pendiente', 'contactado', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  notasAdmin: { type: String, default: '' },
  emailSentToVentas: { type: Boolean, default: false },
  emailSentToCliente: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
