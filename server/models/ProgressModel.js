const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseVideo', required: true },
  watchedDuration: { type: Number, default: 0 }, // in seconds
  totalDuration: { type: Number, required: true }, // in seconds
  percentage: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
