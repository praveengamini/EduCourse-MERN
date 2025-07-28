const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.REACT_APP_MONGO_URL || 'mongodb://localhost:27017/certificate-validation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;