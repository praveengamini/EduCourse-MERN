<<<<<<< HEAD
import { Schema,model } from "mongoose";
const CourseVideo = Schema({
    title : {type:String,required:true},
    url : {type:String,required:true},
    duration : {type:String,required:true},
})
const CourseVideoModel = model('CourseVideoModel',CourseVideo);
export default CourseVideoModel;
=======
// models/CourseVideoModel.js

const mongoose = require('mongoose');

const courseVideoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: Number, 
        required: true 
    } 
});

module.exports = mongoose.model('CourseVideo', courseVideoSchema);
>>>>>>> FEAT-AddingCourse,EnrollingStudent
