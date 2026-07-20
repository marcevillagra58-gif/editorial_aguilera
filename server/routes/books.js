import express from 'express';
import Book from '../models/Book.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all books (public)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.materia) {
      filters.materia = req.query.materia;
    }
    const books = await Book.find(filters).sort({ id: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// GET single book by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ id: Number(req.params.id) });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// POST — Create new book (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const lastBook = await Book.findOne().sort({ id: -1 });
    const newId = lastBook ? lastBook.id + 1 : 1;
    const book = new Book({ ...req.body, id: newId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
});

// PUT — Update book (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true, runValidators: false }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE — Remove book (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ id: Number(req.params.id) });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

export default router;
