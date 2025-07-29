const express = require('express');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary');
const Certificate = require('../models/CertificateModel');
const User = require('../models/User');
const Course = require('../models/CourseModel');
const router = express.Router();

// Generate unique certificate number
const generateCertificateNumber = async () => {
  let certificateNumber;
  let exists = true;
  
  while (exists) {
    // Generate random 8-digit number
    certificateNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Check if it already exists
    const existingCert = await Certificate.findOne({ certificateNumber });
    exists = !!existingCert;
  }
  
  return certificateNumber;
};

// Generate and store certificate
router.post('/generate-certificate', async (req, res) => {
  try {
    const { studentId, courseId, imageDataUrl } = req.body;
    
    if (!studentId || !courseId || !imageDataUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: studentId, courseId, or imageDataUrl' 
      });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if certificate already exists for this student and course
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

    // Generate unique certificate number
    const certificateNumber = await generateCertificateNumber();

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageDataUrl, {
      folder: 'certificates',
      public_id: `cert_${certificateNumber}_${Date.now()}`,
      resource_type: 'image'
    });

    // Create certificate record
    const certificate = new Certificate({
      studentId,
      courseId,
      certificateUrl: uploadResult.secure_url,
      certificateNumber,
      issuedAt: new Date()
    });

    await certificate.save();

    // Populate the certificate with student and course details
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

// Get all students for dropdown
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

// Get all courses for dropdown
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