const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.post('/', protect, instructor, createCategory);
router.put('/:id', protect, instructor, updateCategory);
router.delete('/:id', protect, instructor, deleteCategory);

module.exports = router;
