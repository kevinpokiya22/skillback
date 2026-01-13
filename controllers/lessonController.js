const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

exports.addLesson = async (req, res) => {
  const { title, videoUrl, duration, order, courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const lesson = await Lesson.create({ title, videoUrl, duration, order });
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLessonsByCourseId = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('lessons');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Find the course that contains this lesson
    const course = await Course.findOne({ lessons: req.params.id });
    if (course) {
      if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Remove lesson from course
      course.lessons = course.lessons.filter(l => l.toString() !== req.params.id);
      await course.save();
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
