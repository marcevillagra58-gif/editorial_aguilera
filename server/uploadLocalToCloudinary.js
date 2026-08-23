// server/uploadLocalToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Book from './models/Book.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadAllToCloudinary = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB para subir portadas a Cloudinary');

    const books = await Book.find({});
    console.log(`📚 Encontrados ${books.length} libros en MongoDB`);

    for (const book of books) {
      if (book.portada && book.portada.startsWith('/portada_')) {
        const localFilePath = path.join(process.cwd(), 'public', book.portada);
        console.log(`⏳ Subiendo ${book.titulo} (${localFilePath}) a Cloudinary...`);
        
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
          folder: 'EDITORIAL_AGUILERA',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 400, height: 560, crop: 'fill', gravity: 'auto' }]
        });

        console.log(`✅ Subido exitosamente: ${uploadResult.secure_url}`);
        book.portada = uploadResult.secure_url;
        await book.save();
      }
    }

    console.log('🎉 Todas las portadas fueron subidas a Cloudinary y guardadas en MongoDB');
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al subir portadas a Cloudinary:', error);
    process.exit(1);
  }
};

uploadAllToCloudinary();
