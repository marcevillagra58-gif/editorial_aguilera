import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  materia: { type: String, required: true },
  precio: { type: Number, required: true },
  precioAnterior: { type: Number },
  formato: { type: String },
  anio: { type: Number },
  edicion: { type: String },
  paginas: { type: Number },
  isbn: { type: String },
  novedad: { type: Boolean, default: false },
  masVendido: { type: Boolean, default: false },
  descripcion: { type: String },
  portada: { type: String, required: true },
  fechaPub: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
