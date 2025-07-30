const Progress = require('../../models/ProgressModel');
const EnrolledCourse = require('../../models/EnrolledCourseModel');
const CourseVideo = require('../../models/CourseVideoModel');
const Course = require('../../models/CourseModel');

const progressController = async (req, res) => {
  const { userId, courseId, videoId, watchedDuration, totalDuration } = req.body;
  if (!userId || !courseId || !videoId || watchedDuration == null || totalDuration == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const percentage = Math.min((watchedDuration / totalDuration) * 100, 100);
  let progress = await Progress.findOne({ userId, courseId, videoId });

  if (!progress) {
    progress = new Progress({ userId, courseId, videoId, watchedDuration, totalDuration, percentage });
  } else {
    progress.watchedDuration = Math.max(progress.watchedDuration, watchedDuration);
    progress.percentage = Math.max(progress.percentage, percentage);
    progress.totalDuration = totalDuration;
    progress.updatedAt = Date.now();
  }

  await progress.save();

  const enrolled = await EnrolledCourse.findOne({ userId, courseId });
  if (!enrolled) return res.status(404).json({ success: false, message: "Enrollment not found" });

  const alreadyIncluded = enrolled.progress.some(id => id.toString() === progress._id.toString());
  if (progress.percentage >= 95 && !alreadyIncluded) {
    enrolled.progress.push(progress._id);
  }

  const course = await Course.findById(courseId).populate('videos');
  const allVideos = course.videos;
  const completedProgress = await Progress.find({ userId, courseId, percentage: { $gte: 95 } });
  const completedVideoIds = completedProgress.map(p => p.videoId.toString());
  const allVideoIds = allVideos.map(v => v._id.toString());

  const allCompleted = allVideoIds.every(id => completedVideoIds.includes(id));

  if (allCompleted && !enrolled.isCompleted) {
    enrolled.isCompleted = true;
    enrolled.completedAt = new Date();
  }

  await enrolled.save();

  res.json({ success: true, percentage: progress.percentage });
};

const courseCompletedProgress = async (req, res) => {
  try {
    const { userId, courseId, videoId } = req.body;

    const video = await CourseVideo.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const totalDuration = video.duration;

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId, videoId },
      {
        percentage: 100,
        watchedDuration: totalDuration,
        totalDuration,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    const enrolled = await EnrolledCourse.findOne({ userId, courseId });
    if (!enrolled) return res.status(404).json({ message: "Enrollment not found" });

    const alreadyIncluded = enrolled.progress.some(id => id.toString() === progress._id.toString());
    if (!alreadyIncluded) {
      enrolled.progress.push(progress._id);
    }

    const course = await Course.findById(courseId).populate('videos');
    const allVideos = course.videos;
    const completedProgress = await Progress.find({ userId, courseId, percentage: { $gte: 95 } });
    const completedVideoIds = completedProgress.map(p => p.videoId.toString());
    const allVideoIds = allVideos.map(v => v._id.toString());

    const allCompleted = allVideoIds.every(id => completedVideoIds.includes(id));

    if (allCompleted && !enrolled.isCompleted) {
      enrolled.isCompleted = true;
      enrolled.completedAt = new Date();
    }

    await enrolled.save();

    res.status(200).json({
      message: 'Progress marked as complete',
      isCompleted: allCompleted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getProgress = async (req, res) => {
  const { userId, courseId, videoId } = req.query;

  const progress = await Progress.findOne({ userId, courseId, videoId });
  if (!progress) return res.json({});

  res.json({
    watchedDuration: progress.watchedDuration,
    percentage: progress.percentage
  });
};

const completedVideos = async (req, res) => {
  const { userId, courseId } = req.query;

  const progress = await Progress.find({ userId, courseId, percentage: { $gte: 95 } }).select('videoId');
  const completedVideoIds = progress.map(p => p.videoId.toString());

  res.json({ completedVideoIds });
};

module.exports = {
  progressController,
  courseCompletedProgress,
  getProgress,
  completedVideos
};
