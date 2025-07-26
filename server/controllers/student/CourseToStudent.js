const EnrolledCourse = require("../../models/EnrolledCourseModel")

const courseToStudent =async (req,res)=>{
    console.log(req.query);
    try{
        const response = await EnrolledCourse.find(req.query);
        console.log(response);
        if (response.length>0){
            res.status(200).json({courseToStudentExists:true});
        }   
        else{
            res.status(200).json({courseToStudentExists:false});
        }
    }
    catch(err){
        res.status(500).send(err);
    }
    
    
}
module.exports ={courseToStudent};