const express = require('express');
const { enrollInCourse, getMyCourses } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);

module.exports = router;
