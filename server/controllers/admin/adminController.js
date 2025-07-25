const cloudinary = require('cloudinary').v2;
const CourseModel = require('../../models/CourseModel');
const CourseVideoModel = require('../../models/CourseVideoModel');
const mongoose = require('mongoose');
const User = require("../../models/User");
const EnrolledCourse = require("../../models/EnrolledCourseModel");
const Progress = require("../../models/ProgressModel")
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(fileBuffer);
  });
};

const addCourse = async (req, res) => {
  try {
    const { title, description, duration, cost } = req.body;
    const adminId = req.user ? req.user._id : new mongoose.Types.ObjectId();

    if (!title || !description || !duration || !req.files.coverImage) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const coverResult = await uploadToCloudinary(req.files.coverImage[0].buffer, {
      resource_type: 'image',
      folder: 'courses/covers'
    });
    const coverImageUrl = coverResult.secure_url;

    let pdfUrls = [];
    if (req.files.pdfs) {
      for (const pdf of req.files.pdfs) {
        const pdfResult = await uploadToCloudinary(pdf.buffer, {
          resource_type: 'raw',
          folder: 'courses/pdfs'
        });
        pdfUrls.push(pdfResult.secure_url);
      }
    }

    const videos = JSON.parse(req.body.videos || '[]');
    let videoIds = [];

    for (const video of videos) {
      const videoDoc = await CourseVideoModel.create({
        title: video.title,
        url: video.url,
        duration: video.duration
      });
      videoIds.push(videoDoc._id);
    }

    const newCourse = await CourseModel.create({
      title,
      description,
      duration,
      cost,
      pdfs: pdfUrls,
      videos: videoIds,
      coverImage: coverImageUrl,
      createdBy: adminId
    });

    res.status(201).json({ message: 'Course added successfully', course: newCourse });

  } catch (err) {
    console.error("Add Course Error:", err);
    res.status(500).json({ message: 'Server error while adding course' });
  }
};

const getDateRange = (period) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch(period) {
    case 'day':
      return {
        start: startOfToday,
        end: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'week':
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      return {
        start: startOfWeek,
        end: now
      };
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start: startOfMonth,
        end: now
      };
    default:
      return {
        start: new Date(0),
        end: now
      };
  }
};

// Get dashboard stats (for cards)
const getStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const { start, end } = getDateRange(period);

    // New Students
    const newStudents = await User.countDocuments({
      createdAt: { $gte: start, $lte: end },
      role: 'student'
    });

    // New Enrollments
    const newEnrollments = await EnrolledCourse.countDocuments({
      enrolledAt: { $gte: start, $lte: end }
    });

    // Active Students (students who made progress in the period)
    const activeStudentsData = await Progress.distinct('userId', {
      updatedAt: { $gte: start, $lte: end }
    });
    const activeStudents = activeStudentsData.length;

    // Completion Rate
    const totalEnrollments = await EnrolledCourse.countDocuments({
      enrolledAt: { $gte: start, $lte: end }
    });
    const completedEnrollments = await EnrolledCourse.countDocuments({
      completedAt: { $gte: start, $lte: end, $ne: null }
    });
    
    const completionRate = totalEnrollments > 0 
      ? Math.round((completedEnrollments / totalEnrollments) * 100) 
      : 0;

    res.json({
      newStudents,
      newEnrollments,
      activeStudents,
      completionRate
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get graph data for trends
const getGraphStats = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    let dateFormat, groupStage, sortStage, periods;

    const now = new Date();

    if (period === 'daily') {
      // Last 30 days
      dateFormat = "%Y-%m-%d";
      periods = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        periods.push(date.toISOString().split('T')[0]);
      }
    } else if (period === 'monthly') {
      // Last 12 months
      dateFormat = "%Y-%m";
      periods = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        periods.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
      }
    } else {
      // Yearly
      dateFormat = "%Y";
      periods = [];
      const currentYear = now.getFullYear();
      for (let i = 4; i >= 0; i--) {
        periods.push(String(currentYear - i));
      }
    }

    // New Students Data
    const studentsAggregation = await User.aggregate([
      {
        $match: {
          role: 'student',
          createdAt: { 
            $gte: new Date(now.getTime() - (period === 'daily' ? 30 : period === 'monthly' ? 365 : 1825) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // New Enrollments Data
    const enrollmentsAggregation = await EnrolledCourse.aggregate([
      {
        $match: {
          enrolledAt: { 
            $gte: new Date(now.getTime() - (period === 'daily' ? 30 : period === 'monthly' ? 365 : 1825) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$enrolledAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Active Students Data
    const activeAggregation = await Progress.aggregate([
      {
        $match: {
          updatedAt: { 
            $gte: new Date(now.getTime() - (period === 'daily' ? 30 : period === 'monthly' ? 365 : 1825) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: dateFormat, date: "$updatedAt" }
            },
            userId: "$userId"
          }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Completion Rate Data
    const completionAggregation = await EnrolledCourse.aggregate([
      {
        $match: {
          enrolledAt: { 
            $gte: new Date(now.getTime() - (period === 'daily' ? 30 : period === 'monthly' ? 365 : 1825) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$enrolledAt" }
          },
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $ne: ["$completedAt", null] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          rate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$completed", "$total"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Helper function to fill missing dates with zero values
    const fillMissingPeriods = (data, periods, valueKey = 'count') => {
      const dataMap = new Map(data.map(item => [item._id, item[valueKey]]));
      return periods.map(period => ({
        period: period,
        [valueKey]: dataMap.get(period) || 0
      }));
    };

    // Format data for charts
    const studentsData = fillMissingPeriods(studentsAggregation, periods);
    const enrollmentsData = fillMissingPeriods(enrollmentsAggregation, periods);
    const activeData = fillMissingPeriods(activeAggregation, periods);
    const completionData = fillMissingPeriods(completionAggregation, periods, 'rate');

    res.json({
      studentsData,
      enrollmentsData,
      activeData,
      completionData
    });

  } catch (error) {
    console.error('Error fetching graph stats:', error);
    res.status(500).json({ error: 'Failed to fetch graph statistics' });
  }
};

// Get detailed analytics (optional - for additional insights)
const getDetailedAnalytics = async (req, res) => {
  try {
    const { start, end } = getDateRange('month');

    // Most popular courses
    const popularCourses = await EnrolledCourse.aggregate([
      {
        $match: {
          enrolledAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$courseId",
          enrollments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $unwind: "$course"
      },
      {
        $project: {
          title: "$course.title",
          enrollments: 1
        }
      },
      {
        $sort: { enrollments: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Average completion time
    const completionTimes = await EnrolledCourse.aggregate([
      {
        $match: {
          completedAt: { $ne: null },
          enrolledAt: { $gte: start, $lte: end }
        }
      },
      {
        $project: {
          completionDays: {
            $divide: [
              { $subtract: ["$completedAt", "$enrolledAt"] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletionDays: { $avg: "$completionDays" }
        }
      }
    ]);

    res.json({
      popularCourses,
      avgCompletionDays: completionTimes[0]?.avgCompletionDays || 0
    });

  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    res.status(500).json({ error: 'Failed to fetch detailed analytics' });
  }
};

module.exports = {
  addCourse,
  getStats,
  getGraphStats,
  getDetailedAnalytics
};