const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseVideo', required: true },
  watchedDuration: { type: Number, default: 0 },
  totalDuration: { type: Number, required: true },
  percentage: { type: Number, default: 0 }
});

module.exports = mongoose.model('Progress', progressSchema);
