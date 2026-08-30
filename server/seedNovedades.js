// syncNovedades.js
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Book from './server/models/Book.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const NOVEDADES_OBER = [
  {
    titulo: '100 Preguntas sobre el Impuesto a las Ganancias',
    autor: 'Hernán M. D’Agostino',
    materia: 'tributario',
    precio: 22400,
    precioAnterior: 26000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 220,
    isbn: '978-987-00-1234-1',
    novedad: true,
    masVendido: false,
    descripcion: 'En el presente libro, el autor contesta las principales preguntas que han surgido en su práctica profesional, de una forma clara y sin ambigüedades. Hernán D’Agostino explica las soluciones a temas que aplican tanto a quienes se inician en la profesión como a quienes tienen experiencia, incluyendo el régimen de exteriorización (blanqueo) y su influencia en la declaración jurada.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2025/04/img_6171-d9521bd983779514de17442221200216-1024-1024.webp',
    slug: '100-preguntas-sobre-el-impuesto-a-las-ganancias-dagostino'
  },
  {
    titulo: '100 Preguntas y Respuestas sobre Propiedad Horizontal',
    autor: 'Chiesa',
    materia: 'civil',
    precio: 74450,
    precioAnterior: 82000,
    formato: 'papel',
    anio: 2024,
    edicion: '1ª edición',
    paginas: 280,
    isbn: '978-987-787-080-0',
    novedad: true,
    masVendido: false,
    descripcion: 'Asambleas. Administrador. Consejo de propietarios. Reglamento de Propiedad Horizontal. Expensas. Responsabilidades. Reparaciones urgentes. El consorcio y las relaciones laborales. Violación al régimen de Propiedad Horizontal. Obras antirreglamentarias.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2024/07/100preguntas-300x300.png',
    slug: '100-preguntas-y-respuestas-sobre-propiedad-horizontal-chiesa'
  },
  {
    titulo: 'Acciones Reales (Teoría y Práctica)',
    autor: 'Martín A. Grilli',
    materia: 'civil',
    precio: 49350,
    precioAnterior: 55000,
    formato: 'papel',
    anio: 2024,
    edicion: '1ª edición',
    paginas: 310,
    isbn: '978-987-787-075-6',
    novedad: true,
    masVendido: false,
    descripcion: 'El Dr. Martín Grilli aborda las acciones reales clásicas (reivindicatoria, negatoria y confesoria), además de división de condominio y deslinde. Explora acciones de defensa en el derecho de propiedad, publicidad, títulos, escrituras públicas y usucapión con modelos de juicios reales.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2024/07/acc-300x300.png',
    slug: 'acciones-reales-teoria-y-practica-grilli'
  },
  {
    titulo: 'Acciones sobre la Vocación y la Legítima Hereditarias',
    autor: 'García Alonso',
    materia: 'civil',
    precio: 40000,
    precioAnterior: 45000,
    formato: 'papel',
    anio: 2026,
    edicion: '1ª edición',
    paginas: 200,
    isbn: '978-987-787-093-0',
    novedad: true,
    masVendido: false,
    descripcion: 'Acciones sobre la vocación y la legítima hereditarias. Editorial García Alonso. 200 págs. / febrero 2026. Análisis riguroso y práctico de la vocación hereditaria, porción legítima y acciones de protección del heredero legitimario.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2026/03/img_9516-313c050e0464cd809e17707497628888-1024-1024.webp',
    slug: 'acciones-sobre-la-vocacion-y-la-legitima-hereditarias'
  },
  {
    titulo: 'Actuación Profesional en el Derecho Sucesorio',
    autor: 'Varios Autores',
    materia: 'civil',
    precio: 42800,
    precioAnterior: 48000,
    formato: 'papel',
    anio: 2024,
    edicion: '2ª edición',
    paginas: 260,
    isbn: '978-987-787-055-8',
    novedad: true,
    masVendido: false,
    descripcion: 'Procesos sucesorios en Nación y Provincia de Buenos Aires. Guía práctica y procesal completa para abogados litigantes: apertura, declaratoria de herederos, inventario, avalúo, partición y trámites electrónicos.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2021/03/Actuacion-Profesional-en-el-Derecho-Sucesorio.jpg',
    slug: 'actuacion-profesional-en-el-derecho-sucesorio'
  },
  {
    titulo: 'Actuación Profesional Juicio de Alimentos',
    autor: 'María Magdalena Diez',
    materia: 'familia',
    precio: 47300,
    precioAnterior: 52000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 340,
    isbn: '978-987-787-088-6',
    novedad: true,
    masVendido: false,
    descripcion: 'Herramienta de práctica profesional en la que se analizan cuestiones de fondo, doctrina y jurisprudencia; normas que regulan el proceso de alimentos, incluida la última reforma de la Ley 15.513 al Código Procesal. Contiene un expediente paso a paso con escritos y proveídos electrónicos en Nación y PBA.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2025/06/JUICIO-DE-ALIMENTOS.png',
    slug: 'actuacion-profesional-juicio-de-alimentos-diez'
  },
  {
    titulo: 'Actualización de la Cuota Alimentaria (Teoría y Práctica)',
    autor: 'Claudio A. Belluscio',
    materia: 'familia',
    precio: 39900,
    precioAnterior: 44000,
    formato: 'papel',
    anio: 2024,
    edicion: '1ª edición',
    paginas: 210,
    isbn: '978-987-787-072-5',
    novedad: true,
    masVendido: false,
    descripcion: 'Actualización de la cuota alimentaria (teoría y práctica). Autor Belluscio, Claudio A. Mecanismos de ajuste, índices de actualización económica, jurisprudencia aplicable y modelos de incidentes de aumento y adecuación de cuota.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2024/07/actua-288x300.png',
    slug: 'actualizacion-de-la-cuota-alimentaria-belluscio'
  },
  {
    titulo: 'Alimentos (2 Tomos)',
    autor: 'Gonzalo Javier Gallo Quintian y Gabriel Hernán Quadri',
    materia: 'familia',
    precio: 550000,
    precioAnterior: 600000,
    formato: 'papel',
    anio: 2024,
    edicion: '2ª edición actualizada y ampliada',
    paginas: 1400,
    isbn: '978-987-30-4560-1',
    novedad: true,
    masVendido: true,
    descripcion: 'Tratado de Alimentos en 2 Tomos. Directores: Gonzalo Javier Gallo Quintian y Gabriel Hernán Quadri. Obra monumental y exhaustiva sobre todos los aspectos sustanciales y procesales de la obligación alimentaria.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2024/09/alimentos-300x300.png',
    slug: 'alimentos-2-tomos-gallo-quintian-quadri'
  },
  {
    titulo: 'Alimentos — Teoría General, Fuentes y Tutela Judicial Efectiva',
    autor: 'Mariel Molina de Juan',
    materia: 'familia',
    precio: 470000,
    precioAnterior: 510000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 850,
    isbn: '978-987-30-4890-9',
    novedad: true,
    masVendido: false,
    descripcion: 'Editorial Rubinzal-Culzoni. Teoría general, fuentes y tutela judicial efectiva de los alimentos. Análisis de la Dra. Mariel Molina de Juan sobre el derecho alimentario contemporáneo con perspectiva constitucional y convencional.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2025/05/whatsapp-image-2025-04-17-at-12-52-32-9ccd1a9238728bbe3217449088733297-1024-1024-1.webp',
    slug: 'alimentos-molina-de-juan'
  },
  {
    titulo: 'Aranceles Profesionales y Aspectos Patrimoniales en el Derecho Procesal (2 Tomos)',
    autor: 'Roberto Malizia',
    materia: 'procesal',
    precio: 444600,
    precioAnterior: 490000,
    formato: 'papel',
    anio: 2025,
    edicion: '1ª edición',
    paginas: 1100,
    isbn: '978-987-30-4920-3',
    novedad: true,
    masVendido: false,
    descripcion: 'Editorial Rubinzal-Culzoni. 2 Tomos. Obra cumbre de Roberto Malizia sobre la regulación de honorarios de abogados y peritos, costas, intereses, ejecución de honorarios y aspectos patrimoniales del proceso civil y comercial.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2025/12/whatsapp-image-2025-09-23-at-09-40-51-24cd044c26a518df0717586313115181-1024-1024.webp',
    slug: 'aranceles-profesionales-y-aspectos-patrimoniales-malizia'
  },
  {
    titulo: 'Auditoría Fiscal: 3º Edición',
    autor: 'Varios Autores',
    materia: 'tributario',
    precio: 89890,
    precioAnterior: 98000,
    formato: 'papel',
    anio: 2024,
    edicion: '3ª edición',
    paginas: 420,
    isbn: '978-987-03-4512-4',
    novedad: true,
    masVendido: false,
    descripcion: 'Técnicas y herramientas de evaluación: diagnóstico tributario, procedimientos de fiscalización y auditoría fiscal integral. Metodologías prácticas para el control y prevención de contingencias fiscales.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2021/03/AUDITORIA-FISCAL.jpeg',
    slug: 'auditoria-fiscal-3-edicion'
  },
  {
    titulo: 'Baremo Laboral',
    autor: 'Editorial Hammurabi',
    materia: 'laboral',
    precio: 43000,
    precioAnterior: 48000,
    formato: 'papel',
    anio: 2026,
    edicion: '1ª edición',
    paginas: 158,
    isbn: '978-631-320-109-9',
    novedad: true,
    masVendido: false,
    descripcion: 'Editorial Hammurabi. Edición 1ª año 2026. Baremo de incapacidades laborales, tablas de evaluación médica y jurídica, fórmulas de cálculo de indemnizaciones por accidentes de trabajo y enfermedades profesionales.',
    oberImg: 'https://oberlibros.com.ar/wp-content/uploads/2026/03/img_9778-a199011ab49176116c17743583448491-1024-1024.webp',
    slug: 'baremo-laboral-hammurabi'
  }
];

async function sync() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  // Primero desmarcar 'novedad: true' en todos para sincronizar exactamente las 12 novedades
  await Book.updateMany({}, { $set: { novedad: false } });

  let nextId = 1;
  const lastBook = await Book.findOne().sort({ id: -1 });
  if (lastBook) nextId = lastBook.id + 1;

  for (const item of NOVEDADES_OBER) {
    let portadaCloudinary = item.oberImg;

    // Subir imagen a Cloudinary para evitar hotlinking o URLs rotas
    try {
      console.log(`Subiendo portada de "${item.titulo}" a Cloudinary...`);
      const uploadRes = await cloudinary.uploader.upload(item.oberImg, {
        folder: 'EDITORIAL_AGUILERA/novedades',
        transformation: [{ width: 450, height: 600, crop: 'fill', gravity: 'auto' }]
      });
      if (uploadRes && uploadRes.secure_url) {
        portadaCloudinary = uploadRes.secure_url;
        console.log(`✅ Imagen subida: ${portadaCloudinary}`);
      }
    } catch (uploadErr) {
      console.warn(`⚠️ No se pudo subir a Cloudinary, se usará la URL original: ${uploadErr.message}`);
    }

    // Buscar si ya existe por slug o título exacto
    let book = await Book.findOne({
      $or: [
        { slug: item.slug },
        { titulo: item.titulo }
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
      book.descripcion = item.descripcion;
      book.portada = portadaCloudinary;
      book.slug = item.slug;
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
        masVendido: item.masVendido || false,
        descripcion: item.descripcion,
        portada: portadaCloudinary,
        slug: item.slug
      });
      await book.save();
    }
  }

  const countNovedades = await Book.countDocuments({ novedad: true });
  console.log(`🎉 Sincronización completa. Libros en Novedades: ${countNovedades}`);

  await mongoose.disconnect();
}

sync();
