const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, default: 'Layout' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
