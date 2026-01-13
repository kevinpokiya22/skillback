const express = require('express');
const { addLesson, getLessonsByCourseId, deleteLesson } = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('instructor', 'admin'), addLesson);
router.get('/:courseId', getLessonsByCourseId);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
