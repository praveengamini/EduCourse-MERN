const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  browser: String,
  os: String,
  time: {
    type: Date,
    default: Date.now,
  },
  token: String, 
});

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  devices: [deviceSchema] 
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
