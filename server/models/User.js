
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const deviceSchema = new Schema({
  browser: String,
  os: String,
  time: {
    type: Date,
    default: Date.now,
  },
  token: String,
});

const UserSchema = new Schema({
  userName: {
    type: String,required: true,
  },
  email: {type: String,required: true,unique: true,
  },
  password: {type: String,required: true,
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdByAdmin:{
    type: Boolean,
    default: false
  },
  devices: [deviceSchema]
});

const User = model("User", UserSchema);
module.exports = User;
