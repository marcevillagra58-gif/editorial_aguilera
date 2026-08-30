// syncHammurabi.js
import dotenv from 'dotenv';
dotenv.config();
import https from 'https';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Book from './server/models/Book.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lista de URLs y precios de las Novedades más destacadas de Hammurabi
const HAMMURABI_NOVEDADES = [
  {
    url: 'https://www.hammurabi.com.ar/productos/bailome-risso-el-derecho-frente-a-la-inteligencia-artificial-2lopc/',
    precio: 89800,
    materia: 'informatico'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/de-cucco-escritura-de-textos-juridicos-1jybv/',
    precio: 126200,
    materia: 'procesal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/basilico-pazos-crocitto-el-sistema-acusatorio-en-el-proceso-penal-federal-tkpwy/',
    precio: 338800,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/aboso-derecho-penal-y-tecnologias-emergentes-asistidas-por-ia-fyjpi/',
    precio: 87800,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/romualdi-intereses-inflacion-y-capitalizacion-en-deudas-de-valor-y-de-dinero-k8lw6/',
    precio: 76800,
    materia: 'civil'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/morelli-modernizacion-laboral-ley-27-802-1at1u/',
    precio: 87800,
    materia: 'laboral'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/contreras-alderete-el-cumplimiento-del-deber-od9dl/',
    precio: 63400,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/petrone-gauna-alsina-delitos-federales-t-3-yz98x/',
    precio: 78400,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/colombo-ejecucion-de-la-pena-privativa-de-la-libertad-vvant/',
    precio: 136900,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/compendio-de-legislacion-penal-nacion-caba-2026-4f6v6/',
    precio: 83200,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/moyano-evidencia-digital-y-litigacion-estrategica-en-el-proceso-penal-1eqoa/',
    precio: 89900,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/mahiques-el-arrepentido-1kpma/',
    precio: 85900,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/bono-lineamientos-de-derecho-inmobiliario-15o2q/',
    precio: 221760,
    materia: 'civil'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/romualdi-la-reforma-laboral-18tk4/',
    precio: 87800,
    materia: 'laboral'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/latino-mayordomo-practica-de-derecho-notarial-1x6wv/',
    precio: 125900,
    materia: 'civil'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/di-salvo-el-lugar-del-hecho-1eqx5/',
    precio: 89800,
    materia: 'penal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/morel-derecho-del-turismo-6g0z1/',
    precio: 134800,
    materia: 'comercial'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/sandiano-el-proceso-digital-95z52/',
    precio: 89900,
    materia: 'procesal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/leguizamon-lozano-el-juez-ante-el-espejo-algoritmico-g7u7s/',
    precio: 75600,
    materia: 'procesal'
  },
  {
    url: 'https://www.hammurabi.com.ar/productos/druetta-contratacion-administrativa-irregular/',
    precio: 99900,
    materia: 'administrativo'
  }
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function sync() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  let nextId = 1;
  const lastBook = await Book.findOne().sort({ id: -1 });
  if (lastBook) nextId = lastBook.id + 1;

  let addedCount = 0;

  for (const item of HAMMURABI_NOVEDADES) {
    try {
      console.log(`\nConsultando página: ${item.url}`);
      const html = await fetchPage(item.url);

      const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      const ogDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);

      let rawTitle = ogTitleMatch ? cleanText(ogTitleMatch[1]) : '';
      let autor = 'Editorial Hammurabi';
      let titulo = rawTitle;

      // Si el título contiene "Autor. Título" o "Autor - Título"
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        if (parts.length >= 2) {
          autor = parts.slice(0, parts.length - 1).join(' - ').trim();
          titulo = parts[parts.length - 1].trim();
        }
      } else if (rawTitle.includes('. ')) {
        const parts = rawTitle.split('. ');
        if (parts.length >= 2) {
          autor = parts[0].trim();
          titulo = parts.slice(1).join('. ').trim();
        }
      }

      let descripcion = ogDescMatch ? cleanText(ogDescMatch[1]) : 'Obra jurídica de destacada excelencia doctrinal y procesal.';
      let imgUrl = ogImgMatch ? ogImgMatch[1].replace('http://', 'https://') : '';

      // Subir portada a Cloudinary
      let portadaCloudinary = imgUrl;
      if (imgUrl) {
        try {
          console.log(`Subiendo portada a Cloudinary para: ${titulo}...`);
          const uploadRes = await cloudinary.uploader.upload(imgUrl, {
            folder: 'EDITORIAL_AGUILERA/hammurabi',
            transformation: [{ width: 450, height: 600, crop: 'fill', gravity: 'auto' }]
          });
          if (uploadRes && uploadRes.secure_url) {
            portadaCloudinary = uploadRes.secure_url;
            console.log(`✅ Imagen en Cloudinary: ${portadaCloudinary}`);
          }
        } catch (e) {
          console.warn(`⚠️ No se pudo subir a Cloudinary: ${e.message}`);
        }
      }

      const slug = titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Buscar si ya existe por slug o título
      let book = await Book.findOne({
        $or: [
          { slug: slug },
          { titulo: titulo }
        ]
      });

      if (book) {
        console.log(`Actualizando libro existente ID ${book.id}: ${titulo}`);
        book.titulo = titulo;
        book.autor = autor;
        book.materia = item.materia;
        book.precio = item.precio;
        book.precioAnterior = Math.round(item.precio * 1.15 / 100) * 100;
        book.novedad = true;
        book.descripcion = descripcion;
        if (portadaCloudinary) book.portada = portadaCloudinary;
        await book.save();
      } else {
        console.log(`Creando nuevo libro ID ${nextId}: ${titulo} (${autor})`);
        book = new Book({
          id: nextId++,
          titulo: titulo,
          autor: autor,
          materia: item.materia,
          precio: item.precio,
          precioAnterior: Math.round(item.precio * 1.15 / 100) * 100,
          formato: 'papel',
          anio: 2026,
          edicion: '1ª edición',
          paginas: 280,
          isbn: '978-950-741-' + Math.floor(1000 + Math.random() * 9000) + '-0',
          novedad: true,
          masVendido: false,
          descripcion: descripcion,
          portada: portadaCloudinary,
          slug: slug
        });
        await book.save();
        addedCount++;
      }
    } catch (err) {
      console.error(`Error procesando ${item.url}:`, err.message);
    }
  }

  const totalNovedades = await Book.countDocuments({ novedad: true });
  const totalBooks = await Book.countDocuments();
  console.log(`\n🎉 Sincronización finalizada.`);
  console.log(`Novedades añadidas/actualizadas: ${addedCount}`);
  console.log(`Total libros en Novedades: ${totalNovedades}`);
  console.log(`Total catálogo general: ${totalBooks}`);

  await mongoose.disconnect();
}

sync();
