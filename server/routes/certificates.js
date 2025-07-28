const express = require('express');
const Certificate = require('../models/CertificateModel');
const User = require('../models/User');
const Course = require('../models/CourseModel');
const router = express.Router();

// Validate certificate by certificate number
router.get('/validate/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    
    const certificate = await Certificate.findOne({ certificateNumber })
      .populate('studentId', 'userName email')
      .populate('courseId', 'title description');
    
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found' 
      });
    }

    res.json({
      success: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        certificateUrl: certificate.certificateUrl,
        issuedAt: certificate.issuedAt,
        student: certificate.studentId,
        course: certificate.courseId
      }
    });
  } catch (error) {
    console.error('Certificate validation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during certificate validation' 
    });
  }
});

// Get all certificates (admin only)
router.get('/all', async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('studentId', 'userName email')
      .populate('courseId', 'title')
      .sort({ issuedAt: -1 });
    
    res.json({
      success: true,
      certificates
    });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching certificates' 
    });
  }
});

module.exports = router;