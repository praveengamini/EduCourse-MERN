const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Progress' }],
  isCompleted: { type: Boolean, default: false },
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default : null }
});

module.exports = mongoose.model('EnrolledCourse', enrolledCourseSchema);
