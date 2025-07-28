const Progress = require('../../models/ProgressModel');
const EnrolledCourse = require('../../models/EnrolledCourseModel');
const CourseVideo = require('../../models/CourseVideoModel');
const Certificate = require('../../models/CertificateModel');

const progressController = async (req, res) => {
  const { userId, courseId, videoId, watchedDuration, totalDuration } = req.body;

  const percentage = Math.min((watchedDuration / totalDuration) * 100, 100);

  let progress = await Progress.findOne({ userId, courseId, videoId });

  if (!progress) {
    progress = new Progress({ userId, courseId, videoId, watchedDuration, totalDuration, percentage });
  } else {
    progress.watchedDuration = watchedDuration;
    progress.totalDuration = totalDuration;
    progress.percentage = percentage;
    progress.updatedAt = Date.now();
  }

  await progress.save();

  const enrolled = await EnrolledCourse.findOne({ userId, courseId });
  if (enrolled && !enrolled.progress.includes(progress._id)) {
    enrolled.progress.push(progress._id);
    await enrolled.save();
  }

  res.json({ success: true, percentage });
};

const courseCompletedProgress = async (req, res) => {
  try {
    const { userId, courseId, videoId } = req.body;

    const video = await CourseVideo.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const totalDuration = video.duration;

    await Progress.findOneAndUpdate(
      { userId, courseId, videoId },
      {
        percentage: 100,
        watchedDuration: totalDuration,
        updatedAt: Date.now()
      },
      { new: true }
    );

    const allVideos = await CourseVideo.find({ courseId });
    const completed = await Progress.find({
      userId,
      courseId,
      percentage: { $gte: 95 }
    });

    const allCompleted = allVideos.length > 0 && completed.length === allVideos.length;

    if (allCompleted) {
      const enrolled = await EnrolledCourse.findOne({ userId, courseId });

      if (enrolled && !enrolled.isCompleted) {
        // Find certificate
        const certificate = await Certificate.findOne({ studentId: userId, courseId });

        enrolled.isCompleted = true;
        enrolled.completedAt = new Date();
        enrolled.certificateIssued = true;
        enrolled.certificateId = certificate ? certificate._id : null;
        await enrolled.save();
      }
    }

    res.status(200).json({
      message: 'Progress marked as complete',
      certificateIssued: allCompleted
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
