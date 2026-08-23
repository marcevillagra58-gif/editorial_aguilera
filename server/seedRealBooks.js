// server/seedRealBooks.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const realBooks = [
  {
    id: 1,
    titulo: "100 Preguntas sobre el Impuesto a las Ganancias",
    autor: "Hernán M. D’Agostino",
    materia: "tributario",
    precio: 22400,
    precioAnterior: null,
    formato: "papel",
    anio: 2025,
    edicion: "1ª edición",
    paginas: 280,
    isbn: "978-987-801-100-1",
    novedad: true,
    masVendido: true,
    descripcion: "En el presente libro, el autor contesta las principales preguntas que han surgido en su práctica profesional, de una forma clara y sin ambigüedades. Explica soluciones sobre iniciación profesional, transparencia fiscal y régimen de exteriorización (blanqueo) en la declaración jurada.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2025/04/img_6171-d9521bd983779514de17442221200216-1024-1024-300x300.webp",
    slug: "100-preguntas-sobre-el-impuesto-a-las-ganancias-dagostino"
  },
  {
    id: 2,
    titulo: "100 Preguntas y Respuestas sobre Propiedad Horizontal",
    autor: "Dr. Chiesa",
    materia: "civil",
    precio: 74456,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "2ª edición actualizada",
    paginas: 340,
    isbn: "978-987-752-500-2",
    novedad: true,
    masVendido: true,
    descripcion: "Asambleas. Administrador. Consejo de propietarios. Reglamento de Propiedad Horizontal. Expensas. Responsabilidades. Reparaciones urgentes. El consorcio y las relaciones laborales. Violación al régimen de Propiedad Horizontal.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2024/07/100preguntas-300x300.png",
    slug: "100-preguntas-y-respuestas-sobre-propiedad-horizontal-chiesa"
  },
  {
    id: 3,
    titulo: "200 Modelos de Actuaciones Procesales",
    autor: "Carina V. Suárez",
    materia: "procesal",
    precio: 53912,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "Edición renovada",
    paginas: 410,
    isbn: "978-987-621-400-3",
    novedad: false,
    masVendido: true,
    descripcion: "200 modelos de escritos para la procuración de juicios civiles y comerciales. Una guía práctica imprescindible para el ejercicio forense y la tramitación en juzgados.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2024/07/suarez-200-modelos-de-actuaciones-procesales-civil-comercial-w-300x300.jpg",
    slug: "200-modelos-de-actuaciones-procesales-suarez"
  },
  {
    id: 4,
    titulo: "500 Modelos de Escritos Judiciales",
    autor: "Víctor De Santo",
    materia: "procesal",
    precio: 64200,
    precioAnterior: 75000,
    formato: "papel",
    anio: 2024,
    edicion: "3ª edición",
    paginas: 650,
    isbn: "978-950-745-800-4",
    novedad: false,
    masVendido: true,
    descripcion: "Explicaciones prácticas, doctrina y jurisprudencia. Instrucciones para la correcta redacción de escritos judiciales, demandas, contestaciones, mediación y notificación electrónica.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2024/07/500-modelos-300x300.png",
    slug: "500-modelos-de-escritos-judiciales-de-santo"
  },
  {
    id: 5,
    titulo: "550 Modelos de Cartas Documento",
    autor: "Enrique L. Abatti & Ival Rocca",
    materia: "civil",
    precio: 59041,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "4ª edición",
    paginas: 480,
    isbn: "978-987-470-300-5",
    novedad: false,
    masVendido: false,
    descripcion: "550 ingeniosos modelos de cartas documento, efectivas para probar sin mayores expensas, actos y hechos jurídicos, tanto positivos como negativos.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/09/abatti-rocca-550-modelos-de-cartas-documento-bl-300x300.jpg",
    slug: "550-modelos-de-cartas-documento-abatti-rocca"
  },
  {
    id: 6,
    titulo: "A 30 años de la Convención sobre los Derechos del Niño",
    autor: "Marisa Herrera & Andrés Gil Domínguez",
    materia: "constitucional",
    precio: 221000,
    precioAnterior: null,
    formato: "papel",
    anio: 2023,
    edicion: "1ª edición — Ediar",
    paginas: 890,
    isbn: "978-950-574-400-8",
    novedad: false,
    masVendido: false,
    descripcion: "Análisis profundo sobre el impacto y evolución de la Convención Internacional sobre los Derechos del Niño en la doctrina y jurisprudencia argentina.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/08/a-300x300.png",
    slug: "a-30-anos-de-la-convencion-sobre-los-derechos-del-nino-herrera"
  },
  {
    id: 7,
    titulo: "Aborto — La marea verde desde el derecho",
    autor: "Red de Profesoras Facultad de Derecho UBA",
    materia: "penal",
    precio: 40000,
    precioAnterior: null,
    formato: "papel",
    anio: 2023,
    edicion: "1ª edición — Editores del Sur",
    paginas: 360,
    isbn: "978-987-468-729-6",
    novedad: false,
    masVendido: false,
    descripcion: "Compilado doctrinario y constitucional sobre el debate jurídico, social y normativo en torno a los derechos sexuales y reproductivos en Argentina.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/08/pic_20190308_150607-5acf06a34818e2b5c015520683741970-240-0-240x300.jpg",
    slug: "aborto-la-marea-verde-desde-el-derecho-uba"
  },
  {
    id: 8,
    titulo: "Acceso a la Función Notarial — Tomo 2: Modelos",
    autor: "Horacio Teitelbaum",
    materia: "comercial",
    precio: 72600,
    precioAnterior: null,
    formato: "papel",
    anio: 2022,
    edicion: "Editorial Di Lalla",
    paginas: 400,
    isbn: "978-987-832-100-8",
    novedad: false,
    masVendido: false,
    descripcion: "Casos prácticos y modelos de escrituras y actuaciones notariales. Herramienta fundamental para aspirantes y escribanos en ejercicio.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2024/07/Acceso-A-La-Funcion-Notarial.-Tomo-2.jpg",
    slug: "acceso-a-la-funcion-notarial-tomo-2-teitelbaum"
  },
  {
    id: 9,
    titulo: "Acceso a la Interrupción Voluntaria del Embarazo — Ley 27.610",
    autor: "AA.VV.",
    materia: "familia",
    precio: 211577,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "Análisis normativo Ley 27.611",
    paginas: 520,
    isbn: "978-987-841-900-9",
    novedad: true,
    masVendido: false,
    descripcion: "Atención y cuidado integral de la salud durante el embarazo y la primera infancia (Ley 27.611 y Ley 27.610). Estudio detallado de la aplicación en el sistema de salud.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2024/07/acceso-voluntario-a-la-interrupcion-del-embarazo-300x300.jpg",
    slug: "acceso-a-la-interrupcion-voluntaria-del-embarazo-ley-27610"
  },
  {
    id: 10,
    titulo: "Accidentes de Automotores — Tomo I",
    autor: "Mario A. Zelaya & Luis R. Silva",
    materia: "daños",
    precio: 357476,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "2ª edición ampliada",
    paginas: 780,
    isbn: "978-987-750-100-0",
    novedad: false,
    masVendido: true,
    descripcion: "Régimen dominial del automotor y responsabilidad en accidentes de tránsito. Jurisprudencia y cuantificación de daños personales y materiales.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/08/accidente-de-automotores-300x300.png",
    slug: "accidentes-de-automotores-zelaya-silva"
  },
  {
    id: 11,
    titulo: "Accidentes de Tránsito — Doctrina y Jurisprudencia",
    autor: "Dr. Carlos A. Ghersi",
    materia: "daños",
    precio: 165825,
    precioAnterior: null,
    formato: "papel",
    anio: 2023,
    edicion: "3ª edición",
    paginas: 610,
    isbn: "978-950-574-311-7",
    novedad: false,
    masVendido: false,
    descripcion: "Tratado doctrinario y fallos plenarios sobre la responsabilidad civil del conductor, aseguradoras, peatones y la vía pública.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/08/accidentes-de-transito-300x300.jpg",
    slug: "accidentes-de-transito-doctrina-jurisprudencia-ghersi"
  },
  {
    id: 12,
    titulo: "Accidentes de Tránsito — Colección Práctica Profesional",
    autor: "Roberto Malizia",
    materia: "daños",
    precio: 218835,
    precioAnterior: null,
    formato: "papel",
    anio: 2024,
    edicion: "Colección Práctica",
    paginas: 490,
    isbn: "978-987-621-888-2",
    novedad: true,
    masVendido: false,
    descripcion: "Modelos de escritos para demandas por choques, reclamos administrativos ante aseguradoras, mediaciones y beneficio de litigar sin gastos.",
    portada: "https://oberlibros.com.ar/wp-content/uploads/2020/08/accidentes-de-transito-Malizia-300x300.jpg",
    slug: "accidentes-de-transito-practica-profesional-malizia"
  }
];

const seedRealBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para cargar libros reales');

    await Book.deleteMany({});
    console.log('🗑️  Se eliminaron los libros ficticios anteriores');

    await Book.insertMany(realBooks);
    console.log('📚 Se ingresaron los 12 libros reales exitosamente');

    mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar libros:', error);
    process.exit(1);
  }
};

seedRealBooks();
