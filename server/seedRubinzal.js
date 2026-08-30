// syncRubinzal.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Book from './models/Book.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const RUBINZAL_NOVEDADES = [
  {
    titulo: 'Juicio Ejecutivo, Ejecuciones Especiales y Proceso Monitorio (2 Tomos)',
    autor: 'Enrique M. Falcón — Actualizado por Jorge A. Rojas y José M. Salgado',
    materia: 'procesal',
    precio: 714000,
    precioAnterior: 785000,
    formato: 'papel',
    anio: 2026,
    edicion: '4ª edición actualizada',
    paginas: 1350,
    isbn: '978-987-30-4980-7',
    novedad: true,
    masVendido: true,
    descripcion: 'Obra cumbre de Enrique M. Falcón, actualizada por Jorge A. Rojas y José María Salgado. 2 Tomos. Análisis integral del juicio ejecutivo, títulos ejecutivos, excepciones, subasta y ejecuciones especiales, junto con el régimen procesal completo del Proceso Monitorio moderno.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/juicio-ejecutivo.png',
    slug: 'juicio-ejecutivo-ejecuciones-especiales-y-proceso-monitorio-falcon'
  },
  {
    titulo: 'Delitos Informáticos y Cibercrimen Organizado (2 Tomos)',
    autor: 'Ricardo Ángel Basílico (Dir.) — Mariano Nicolás Lima (Coord.)',
    materia: 'penal',
    precio: 420280,
    precioAnterior: 470000,
    formato: 'papel',
    anio: 2026,
    edicion: '1ª edición',
    paginas: 1100,
    isbn: '978-987-30-4960-9',
    novedad: true,
    masVendido: true,
    descripcion: 'Director: Ricardo Ángel Basílico. Coordinador: Mariano Nicolás Lima. 2 Tomos. Tratamiento dogmático y procesal de los delitos informáticos, ciberestafas, grooming, phishing, ransomware, criptoactivos, lavado de dinero digital y técnicas especiales de investigación en cibercrimen.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/delitos-informaticos.png',
    slug: 'delitos-informaticos-cibercrimen-organizado-basilico'
  },
  {
    titulo: 'Visión Jurisprudencial del Código Civil y Comercial a diez años de su vigencia (3 Tomos)',
    autor: 'Ricardo Luis Lorenzetti (Dir.) — María Paula Pontoriero (Coord.)',
    materia: 'civil',
    precio: 1047800,
    precioAnterior: 1150000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 2200,
    isbn: '978-987-30-4940-1',
    novedad: true,
    masVendido: true,
    descripcion: 'Director: Ricardo Luis Lorenzetti. Coordinadora: María Paula Pontoriero. 3 Tomos. Balance doctrinario y jurisprudencial a una década de la sanción del Código Civil y Comercial de la Nación. Criterios de la Corte Suprema y tribunales superiores del país.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/vision-dura.png',
    slug: 'vision-jurisprudencial-codigo-civil-y-comercial-lorenzetti'
  },
  {
    titulo: 'Código Procesal Penal Federal Comentado (3 Tomos)',
    autor: 'Edgardo Alberto Donna — Horacio Leonardo Días',
    materia: 'penal',
    precio: 970200,
    precioAnterior: 1060000,
    formato: 'papel',
    anio: 2025,
    edicion: '2ª edición ampliada y actualizada (Leyes 27.784 y 27.785)',
    paginas: 1950,
    isbn: '978-987-30-4910-4',
    novedad: true,
    masVendido: true,
    descripcion: 'Autores: Edgardo Alberto Donna y Horacio Leonardo Días. 3 Tomos. 2ª edición ampliada y actualizada con las Leyes 27.784 y 27.785. Comentario artículo por artículo del CPPF con jurisprudencia del sistema acusatorio federal.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/cppf-dura.png',
    slug: 'codigo-procesal-penal-federal-comentado-donna-dias'
  },
  {
    titulo: 'Proceso de Daños (3 Tomos)',
    autor: 'Jorge Mosset Iturraspe — Miguel A. Piedecasas',
    materia: 'danos',
    precio: 937750,
    precioAnterior: 1030000,
    formato: 'papel',
    anio: 2024,
    edicion: '1ª edición',
    paginas: 2100,
    isbn: '978-987-30-4850-3',
    novedad: true,
    masVendido: true,
    descripcion: 'Autores: Jorge Mosset Iturraspe y Miguel A. Piedecasas. 3 Tomos. Tratado integral sobre el litigio en materia de daños y perjuicios: cuantificación de la indemnización, rubros resarcitorios, prueba pericial y médica, responsabilidad civil y modelos de demandas.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/proceso-danos-ia2.png',
    slug: 'proceso-de-danos-mosset-iturraspe-piedecasas'
  },
  {
    titulo: 'Tratado de Derecho Constitucional (2 Tomos)',
    autor: 'Horacio Daniel Rosatti',
    materia: 'constitucional',
    precio: 723400,
    precioAnterior: 795000,
    formato: 'papel',
    anio: 2025,
    edicion: '3ª edición ampliada y actualizada',
    paginas: 1600,
    isbn: '978-987-30-4880-0',
    novedad: true,
    masVendido: true,
    descripcion: 'Autor: Horacio Daniel Rosatti (Presidente de la Corte Suprema de Justicia de la Nación). 2 Tomos. 3ª edición ampliada y actualizada. Análisis profundo de la dogmática constitucional, control de convencionalidad, división de poderes y federalismo argentino.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/tratado-consitucional-ia2.png',
    slug: 'tratado-de-derecho-constitucional-rosatti'
  },
  {
    titulo: 'Aranceles Profesionales y Aspectos Patrimoniales en el Derecho Procesal (2 Tomos)',
    autor: 'Roberto Malizia (Dir.) — M. F. Domínguez, F. Guerino, N. Russo',
    materia: 'procesal',
    precio: 431200,
    precioAnterior: 475000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 1100,
    isbn: '978-987-30-4920-3',
    novedad: true,
    masVendido: false,
    descripcion: 'Director: Roberto Malizia. Autores: María Fernanda Domínguez, Fernando Guerino, Roberto Malizia y Nadia Russo. 2 Tomos. Honorarios de abogados y auxiliares de justicia, beneficio de litigar sin gastos, costas, intereses y ejecución forzada de honorarios.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/arancelesx.png',
    slug: 'aranceles-profesionales-y-aspectos-patrimoniales-malizia'
  },
  {
    titulo: 'Teoría General de los Derechos Económicos, Sociales, Culturales y Ambientales (2 Tomos)',
    autor: 'Marcela I. Basterra',
    materia: 'constitucional',
    precio: 412700,
    precioAnterior: 455000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 1200,
    isbn: '978-987-30-4930-2',
    novedad: true,
    masVendido: false,
    descripcion: 'Autora: Marcela I. Basterra. Prólogo de Eduardo Ferrer Mac-Gregor. 2 Tomos. Estudio integral de los DESCA en el derecho constitucional y convencional. Exigibilidad, justiciabilidad, políticas públicas y estándares de la Corte Interamericana de Derechos Humanos.',
    imgUrl: 'https://www.rubinzal.com.ar/tienda/imgtmp/teoria-general-ambientales.png',
    slug: 'teoria-general-de-los-derechos-economicos-sociales-culturales-ambientales-basterra'
  }
];

async function sync() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  let nextId = 1;
  const lastBook = await Book.findOne().sort({ id: -1 });
  if (lastBook) nextId = lastBook.id + 1;

  for (const item of RUBINZAL_NOVEDADES) {
    let portadaCloudinary = item.imgUrl;

    try {
      console.log(`Subiendo portada de "${item.titulo}" a Cloudinary...`);
      const uploadRes = await cloudinary.uploader.upload(item.imgUrl, {
        folder: 'EDITORIAL_AGUILERA/rubinzal',
        transformation: [{ width: 450, height: 600, crop: 'fill', gravity: 'auto' }]
      });
      if (uploadRes && uploadRes.secure_url) {
        portadaCloudinary = uploadRes.secure_url;
        console.log(`✅ Portada en Cloudinary: ${portadaCloudinary}`);
      }
    } catch (err) {
      console.warn(`⚠️ No se pudo subir a Cloudinary: ${err.message}`);
    }

    let book = await Book.findOne({
      $or: [
        { slug: item.slug },
        { titulo: new RegExp(item.titulo.split('(')[0].trim(), 'i') }
      ]
    });

    if (book) {
      console.log(`Actualizando libro existente ID ${book.id}: ${item.titulo}`);
      book.titulo = item.titulo;
      book.autor = item.autor;
      book.materia = item.materia;
      book.precio = item.precio;
      book.precioAnterior = item.precioAnterior;
      book.formato = item.formato;
      book.anio = item.anio;
      book.edicion = item.edicion;
      book.paginas = item.paginas;
      book.isbn = item.isbn;
      book.novedad = true;
      book.masVendido = item.masVendido;
      book.descripcion = item.descripcion;
      book.portada = portadaCloudinary;
      await book.save();
    } else {
      console.log(`Creando nuevo libro ID ${nextId}: ${item.titulo}`);
      book = new Book({
        id: nextId++,
        titulo: item.titulo,
        autor: item.autor,
        materia: item.materia,
        precio: item.precio,
        precioAnterior: item.precioAnterior,
        formato: item.formato,
        anio: item.anio,
        edicion: item.edicion,
        paginas: item.paginas,
        isbn: item.isbn,
        novedad: true,
        masVendido: item.masVendido,
        descripcion: item.descripcion,
        portada: portadaCloudinary,
        slug: item.slug
      });
      await book.save();
    }
  }

  const totalNovedades = await Book.countDocuments({ novedad: true });
  const totalBooks = await Book.countDocuments();
  console.log(`\n🎉 Sincronización de Rubinzal completada.`);
  console.log(`Total libros en Novedades: ${totalNovedades}`);
  console.log(`Total catálogo general: ${totalBooks}`);

  await mongoose.disconnect();
}

sync();
