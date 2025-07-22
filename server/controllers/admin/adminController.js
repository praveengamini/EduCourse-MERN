const cloudinary = require('cloudinary').v2;
const CourseModel = require('../../models/CourseModel');
const CourseVideoModel = require('../../models/CourseVideoModel');
const mongoose = require('mongoose');
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

exports.addCourse = async (req, res) => {
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
