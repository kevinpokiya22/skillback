const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
