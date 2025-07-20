<<<<<<< HEAD
import { Schema,model } from "mongoose";
import CourseVideoModel from "./CourseVideoModel";

const Course = Schema({
    title : {type:String,required:true},
    description : {type:String,required:true},
    duration : {type:String,required:true},
    cost : {type:Number,required:true}, 
    videos :{type:[CourseVideoModel]},
    pdfs : {type :[String]},
    createdBy : {type:String,required:true},
    createdAt :{type:Date, default:Date.now(),}
})

const CourseModel = model('Course',Course);
export default CourseModel;
=======
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
>>>>>>> FEAT-AddingCourse,EnrollingStudent
