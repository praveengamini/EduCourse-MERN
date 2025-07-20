// models/ContactFormModel.js

const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({

  userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
  courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    },
  message: { 
        type: String, 
        required: true 
    },
  submittedAt: { 
        type: Date, 
        default: Date.now 
    },
  isRead: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('ContactForm', contactFormSchema);
