const express = require('express');
const EnrolledCourse = require('../../models/EnrolledCourseModel');
const Course = require('../../models/CourseModel');
const Certificate = require('../../models/CertificateModel');
const User = require('../../models/User');
const Progress = require('../../models/ProgressModel');

// const getDashBoardStats = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const enrolled = await EnrolledCourse.find({ userId }).populate('courseId');
//     const certificates = await Certificate.find({ studentId: userId });
//     const profile = await User.findById(userId);
//     const allCourses = await Course.find();

//     const enrolledCourses = enrolled.map((ec) => {
//       const totalVideos = ec.courseId.videos?.length || 0;
//       const completed = ec.progress.length;
//       const progress = totalVideos === 0 ? 0 : Math.round((completed / totalVideos) * 100);

//       return {
//         _id: ec.courseId._id,
//         title: ec.courseId.title,
//         totalVideos,
//         progress,
//         coverImage: ec.courseId.coverImage || "",
//         duration: ec.duration || 0,
//         description: ec.description?.substring(0, 50) || ""
//       };
//     });

//     const response = {
//       stats: {
//         enrolled: enrolled.length,
//         completed: enrolled.filter((c) => c.isCompleted).length,
//         time: 0, 
//         certificates: certificates.length
//       },
//       enrolledCourses,
//       allCourses: allCourses.map((course) => ({
//         _id: course._id,
//         title: course.title,
//         videos: course.videos,
//         coverImage: course.coverImage || "",
//         duration: course.duration || 0,
//         description: course.description?.substring(0, 50) || ""
//       })),
//       certificates,
//       profile
//     };

//     res.json(response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

const getDashBoardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const enrolled = await EnrolledCourse.find({ userId }).populate('courseId');
    const certificates = await Certificate.find({ studentId: userId });
    const profile = await User.findById(userId);
    const allCourses = await Course.find();

    let totalWatchedSeconds = 0;

    const enrolledCourses = await Promise.all(enrolled.map(async (ec) => {
      const course = await Course.findById(ec.courseId._id);
      const totalVideos = course.videos?.length || 0;

      // Fetch all progress entries for this user and course
      const progressList = await Progress.find({
        userId,
        courseId: course._id
      });

      const completed = progressList.length;

      // Sum watched durations
      const watchedSeconds = progressList.reduce((acc, prog) => acc + (prog.watchedDuration || 0), 0);
      totalWatchedSeconds += watchedSeconds;

      const progress = totalVideos === 0 ? 0 : Math.round((completed / totalVideos) * 100);

      return {
        _id: course._id,
        title: course.title,
        totalVideos,
        progress,
        coverImage: course.coverImage || "", 
        duration: course.duration || 0, 
        description: course.description?.substring(0, 50) || ""
      };
    }));

    const hours = Math.floor(totalWatchedSeconds / 3600);
    const minutes = Math.floor((totalWatchedSeconds % 3600) / 60);
    const seconds = Math.floor(totalWatchedSeconds % 60);

    let watchedTime = '';
    if (hours > 0) watchedTime += `${hours}hr `;
    if (minutes > 0 || hours > 0) watchedTime += `${minutes}min `;
    watchedTime += `${seconds}s`;

    const response = {
      stats: {
        enrolled: enrolled.length,
        completed: enrolled.filter((c) => c.isCompleted).length,
        time: watchedTime,
        certificates: certificates.length
      },
      enrolledCourses,
      allCourses: allCourses.map((course) => ({
        _id: course._id,
        title: course.title,
        videos: course.videos,
        coverImage: course.coverImage || "",
        duration: course.duration || 0,
        description: course.description?.substring(0, 50) || ""
      })),
      certificates,
      profile
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = getDashBoardStats;
