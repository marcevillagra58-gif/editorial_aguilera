// server/seedTargetBooks.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const targetBooks = [
  {
    id: 1,
    titulo: "Salud y medioambiente en el Derecho del trabajo",
    autor: "Jorge Rubén Afarián",
    materia: "laboral",
    precio: 66000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "1ª edición — BDF",
    paginas: 320,
    isbn: "978-987-801-201-1",
    novedad: true,
    masVendido: true,
    descripcion: "La acción sindical. La contaminación del asbesto en el transporte subterráneo de la Ciudad de Buenos Aires. Actualizado con la Ley de Modernización Laboral N° 27.802.",
    portada: "/portada_salud_medioambiente_1787517714679.jpg",
    slug: "salud-y-medioambiente-en-el-derecho-del-trabajo-afarian"
  },
  {
    id: 2,
    titulo: "El Nuevo Derecho Laboral",
    autor: "Sergio Lois & Gabriela Cherubin",
    materia: "laboral",
    precio: 65000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "1ª edición — Ediciones DyD",
    paginas: 380,
    isbn: "978-987-801-202-8",
    novedad: true,
    masVendido: true,
    descripcion: "La modernización laboral regresiva desde la práctica profesional. Qué cambió y qué permanece. Cómo defender cada caso. Ley N° 27.802 y reglamentación. Casos, modelos y nuevo procedimiento.",
    portada: "/portada_el_nuevo_derecho_laboral_1787517740261.jpg",
    slug: "el-nuevo-derecho-laboral-lois-cherubin"
  },
  {
    id: 3,
    titulo: "Modernización Laboral — Actuación Profesional",
    autor: "Sergio O. Rodríguez",
    materia: "laboral",
    precio: 65000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "1ª edición — Ediciones DyD",
    paginas: 350,
    isbn: "978-987-801-203-5",
    novedad: true,
    masVendido: true,
    descripcion: "Reclamar, liquidar y litigar en el nuevo régimen y su reglamentación. Indemnizaciones, reparación integral, FAL, actualización de créditos e inconstitucionalidades.",
    portada: "/portada_modernizacion_laboral_1787517770024.jpg",
    slug: "modernizacion-laboral-actuacion-profesional-rodriguez"
  },
  {
    id: 4,
    titulo: "Inocencia Fiscal — Ley 27.799 explicada",
    autor: "Gerardo E. Vega, Juan M. Vega & María S. Vega",
    materia: "tributario",
    precio: 30000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "1ª edición — Ediciones DyD",
    paginas: 290,
    isbn: "978-987-801-204-2",
    novedad: true,
    masVendido: false,
    descripcion: "Protección del contribuyente. Delitos tributarios, evasión fiscal, prescripción corta, régimen simplificado. Prólogo de Carlos María Falco.",
    portada: "/portada_inocencia_fiscal_1787517801510.jpg",
    slug: "inocencia-fiscal-ley-27799-explicada-vega"
  },
  {
    id: 5,
    titulo: "Reglamentación de la Ley de Modernización Laboral N° 27.802",
    autor: "Mario E. Ackerman",
    materia: "laboral",
    precio: 100000,
    precioAnterior: 115000,
    formato: "papel",
    anio: 2026,
    edicion: "Rubinzal-Culzoni Editores",
    paginas: 480,
    isbn: "978-987-730-205-9",
    novedad: true,
    masVendido: true,
    descripcion: "Análisis exegético y jurisprudencial de los Decretos 315/2026, 407/2026, 408/2026 y 409/2026 reglamentarios de la reforma laboral.",
    portada: "/portada_reglamentacion_modernizacion_laboral_1787517835639.jpg",
    slug: "reglamentacion-ley-modernizacion-laboral-ackerman"
  },
  {
    id: 6,
    titulo: "Delitos contra la seguridad del tránsito y transportes",
    autor: "Director: Jonatan L. Bregantic (Coord. G. A. Romero)",
    materia: "penal",
    precio: 149000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "Ad-Hoc Editorial",
    paginas: 540,
    isbn: "978-987-730-206-6",
    novedad: false,
    masVendido: false,
    descripcion: "Estudio dogmático de los delitos contra la seguridad del tránsito, medios de transporte y de comunicación. Prólogo de Edgardo Alberto Donna.",
    portada: "/portada_delitos_seguridad_transito_1787517876544.jpg",
    slug: "delitos-contra-la-seguridad-del-transito-bregantic"
  },
  {
    id: 7,
    titulo: "Muerte digital — Régimen jurídico post mortem",
    autor: "Hugo Alfredo Vaninetti",
    materia: "civil",
    precio: 80000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "1ª edición — Hammurabi",
    paginas: 310,
    isbn: "978-987-801-207-3",
    novedad: true,
    masVendido: false,
    descripcion: "Identidad digital, bienes digitales, herencia digital, protección de datos post mortem, testamento digital y voluntad de protección de privacidad.",
    portada: "/portada_muerte_digital_1787517919810.jpg",
    slug: "muerte-digital-regimen-juridico-vaninetti"
  },
  {
    id: 8,
    titulo: "Corte Suprema de Justicia — Plazo razonable del proceso penal",
    autor: "Nelson R. Pessoa (Colab. Neri Sebastián Trossero)",
    materia: "procesal",
    precio: 135000,
    precioAnterior: null,
    formato: "papel",
    anio: 2025,
    edicion: "Rubinzal-Culzoni Editores",
    paginas: 520,
    isbn: "978-987-730-208-0",
    novedad: false,
    masVendido: true,
    descripcion: "La garantía del plazo razonable de duración del proceso penal en la jurisprudencia de la Corte Suprema de Justicia de la Nación y organismos internacionales.",
    portada: "/portada_corte_suprema_plazo_razonable_1787517967359.jpg",
    slug: "corte-suprema-de-justicia-plazo-razonable-proceso-penal-pessoa"
  },
  {
    id: 9,
    titulo: "Régimen Penal Juvenil — Ley 27.801",
    autor: "Director: Edgardo Alberto Donna",
    materia: "penal",
    precio: 195000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "Rubinzal-Culzoni Editores",
    paginas: 680,
    isbn: "978-987-730-209-7",
    novedad: true,
    masVendido: true,
    descripcion: "Comentario integral a la Ley 27.801 del Régimen Penal Juvenil. Imputabilidad, medidas socioeducativas, debido proceso penal juvenil y garantías constitucionales.",
    portada: "/portada_regimen_penal_juvenil_1787518023206.jpg",
    slug: "regimen-penal-juvenil-ley-27801-donna"
  },
  {
    id: 10,
    titulo: "Entrevista única en Cámara Gesell... ¿Qué?",
    autor: "Edwin Wilson Villanueva Altamirano",
    materia: "procesal",
    precio: 85000,
    precioAnterior: null,
    formato: "papel",
    anio: 2025,
    edicion: "Yurista Editores",
    paginas: 340,
    isbn: "978-987-801-210-3",
    novedad: false,
    masVendido: false,
    descripcion: "Guía práctica y metodológica sobre la realización e impugnación de la entrevista única en Cámara Gesell en niños, niñas y adolescentes víctimas o testigos.",
    portada: "/portada_entrevista_unica_camara_gesell_1787518076578.jpg",
    slug: "entrevista-unica-en-camara-gesell-villanueva"
  },
  {
    id: 11,
    titulo: "La participación del abogado y el perito de parte en la Cámara Gesell",
    autor: "Clara E. Vicente Cayllahua",
    materia: "procesal",
    precio: 90000,
    precioAnterior: null,
    formato: "papel",
    anio: 2025,
    edicion: "Editorial Jurídica",
    paginas: 360,
    isbn: "978-987-801-211-0",
    novedad: false,
    masVendido: false,
    descripcion: "Análisis del rol activo de la defensa, querella y peritos de parte en el desarrollo de la prueba testimonial en Cámara Gesell.",
    portada: "/portada_participacion_abogado_camara_gesell_1787518134906.jpg",
    slug: "la-participacion-del-abogado-en-la-camara-gesell-vicente"
  },
  {
    id: 12,
    titulo: "Criterios de oportunidad en el proceso penal",
    autor: "Carlos M. Romero Berdullas",
    materia: "penal",
    precio: 80000,
    precioAnterior: null,
    formato: "papel",
    anio: 2026,
    edicion: "2ª edición — Hammurabi",
    paginas: 390,
    isbn: "978-987-801-212-7",
    novedad: true,
    masVendido: false,
    descripcion: "Su análisis desde los derechos y garantías constitucionales. Disponibilidad de la acción penal, archivo, conciliación, reparación e insignificancia.",
    portada: "/portada_criterios_oportunidad_proceso_penal_1787518200204.jpg",
    slug: "criterios-de-oportunidad-en-el-proceso-penal-romero-berdullas"
  }
];

const seedTargetBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para actualizar libros exactamente de la imagen');

    await Book.deleteMany({});
    console.log('🗑️  Se eliminaron los registros de libros anteriores');

    await Book.insertMany(targetBooks);
    console.log('📚 Se ingresaron los 10 libros exactos de la imagen exitosamente');

    mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar libros:', error);
    process.exit(1);
  }
};

seedTargetBooks();
