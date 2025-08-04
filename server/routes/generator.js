const express = require('express');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');
const Certificate = require('../models/CertificateModel');
const User = require('../models/User');
const Course = require('../models/CourseModel');
const EnrolledCourse = require('../models/EnrolledCourseModel'); 
const router = express.Router();

const generateCertificateNumber = async () => {
  let certificateNumber;
  let exists = true;

  while (exists) {
    certificateNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    const existingCert = await Certificate.findOne({ certificateNumber });
    exists = !!existingCert;
  }

  return certificateNumber;
};

router.post('/generate-certificate', async (req, res) => {
  try {
    const { studentId, courseId, imageDataUrl } = req.body;
    
    if (!studentId || !courseId || !imageDataUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: studentId, courseId, or imageDataUrl' 
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    const existingCertificate = await Certificate.findOne({ 
      studentId, 
      courseId 
    });

    if (existingCertificate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate already exists for this student and course' 
      });
    }

    const certificateNumber = await generateCertificateNumber();

    const uploadResult = await cloudinary.uploader.upload(imageDataUrl, {
      folder: 'certificates',
      public_id: `cert_${certificateNumber}_${Date.now()}`,
      resource_type: 'image'
    });

    const certificate = new Certificate({
      studentId,
      courseId,
      certificateUrl: uploadResult.secure_url,
      certificateNumber,
      issuedAt: new Date()
    });

    await certificate.save();

    await EnrolledCourse.findOneAndUpdate(
      { userId: studentId, courseId },
      {
        certificateIssued: true,
        certificateId: certificate._id
      },
      { new: true }
    );

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('studentId', 'userName email')
      .populate('courseId', 'title description');

    res.json({
      success: true,
      message: 'Certificate generated and stored successfully',
      certificate: {
        id: populatedCertificate._id,
        certificateNumber: populatedCertificate.certificateNumber,
        certificateUrl: populatedCertificate.certificateUrl,
        issuedAt: populatedCertificate.issuedAt,
        student: populatedCertificate.studentId,
        course: populatedCertificate.courseId
      }
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during certificate generation' 
    });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('_id userName email')
      .sort({ userName: 1 });

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching students' 
    });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('_id title description')
      .sort({ title: 1 });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching courses' 
    });
  }
});

module.exports = router;
