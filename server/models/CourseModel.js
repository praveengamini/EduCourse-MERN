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