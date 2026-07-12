import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// GET all books
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.materia) {
      filters.materia = req.query.materia;
    }
    const books = await Book.find(filters);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// GET single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

export default router;
