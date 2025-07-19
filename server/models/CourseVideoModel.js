import { Schema,model } from "mongoose";
const CourseVideo = Schema({
    title : {type:String,required:true},
    url : {type:String,required:true},
    duration : {type:String,required:true},
})
const CourseVideoModel = model('CourseVideoModel',CourseVideo);
export default CourseVideoModel;