// models/CourseModel.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    cost: { 
        type: Number, 
        default: 0 
    },
    pdfs: [{ 
        type: String 
    }],
    videos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CourseVideo' 
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    coverImage : {
        type : String,
        required: true 
    }
});

module.exports = mongoose.model('Course', courseSchema);
