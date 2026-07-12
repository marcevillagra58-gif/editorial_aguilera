import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import { books } from '../src/data/books.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing books');

    // Insert new data
    await Book.insertMany(books);
    console.log('📚 Successfully seeded books collection');

    mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
