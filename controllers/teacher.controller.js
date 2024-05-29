const Teacher=require("../models/teacherModels/teacher.model")
const Subject=require("../models/studentModels/subject.model")
const Section=require("../models/studentModels/section.model")
const Token=require("../middlewares/token.middleware")
const ClassNotes = require("../models/studentModels/classNotes.model");
const  uploadOnCloudinary = require("../utils/cloudinary.util");
const Assignment=require("../models/studentModels/assignment.model")
const Student=require("../models/studentModels/student.model")
const Attendance=require("../models/studentModels/attendance.model")
const AssignmentSolution = require('../models/studentModels/assignmentSolution.model') 

const teacherController={
    login: async(req,res)=>{
        try{
            const {email,password}=req.body;
            const teacher=await Teacher.findOne({email});
            if(!teacher)
            {
                return res.status(404).json({message:"user doesnt exist"})
            }
            if(teacher.password!=password)
            {
                return res.status(400).json({message:"invalid credentials."})
            }
            const accessToken=await Token.signAccessToken(teacher.id);
            res.cookie("accessToken",accessToken,{
                httpOnly:true,
                secure:true,
                sameSite:"none"
            })
            return res.status(200).json({message:"Login successful", name: teacher.name});
        }
        catch(err)
        {
            return res.staus(500).json({message:"internal server error"});
        }
    },
    sectionStudents: async (req, res) => {
        try {           
            const section = await Section.findOne(req.query).populate({path : 'student', select : '-_id -dob -password -section -personalInfo -guardianInfo -contactDetails -educationalDetails -awardsAndAchievements'});      
            return res.status(200).json({ sectionName : section.sectionName, students : section.student, semester : section.semester, batch : section.batch});
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    uploadNotes : async (req, res) => {
        try {
            const {sectionId , subject } = req.query ;
            const teacherId = req.userId ;
            const subjectId = await Subject.findOne({name: subject});
            if(req.file.size>2*1024*1024)
            {
                return res.status(400).json({message:"file size should be less than 2mb."});
            }
            // if(req.file.mimetype!="application/pdf")
            // {
            //     return res.status(400).json({message:"file type not allowed."});
            // }
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudinaryResponse = await uploadOnCloudinary(dataURI);
            const classNotes = new ClassNotes({
                subject : subjectId,
                classNotes : cloudinaryResponse.secure_url,
                section : sectionId ,
                teacher : teacherId
            });
            await classNotes.save() ;
            return res.status(200).json({ message : "Notes uploaded successfully"});
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    sectionSubject: async(req,res)=>{
        try{
            const teacherId=req.userId;
            const data=await Teacher.findOne({_id:teacherId}).populate({path:'subjectSection.section',select:'-student'}).populate({path:'subjectSection.subject',select:'-_id'}).select(['subjectSection','-_id']);
            const sections = data.subjectSection.map(item => { 
                return {
                    section: {
                        sectionId: item.section._id,
                        sectionName: item.section.sectionName,
                        semester: item.section.semester,
                        batch: item.section.batch
                        
                    },
                    subject: {
                        name: item.subject.name,
                        code: item.subject.code
                    }
                };
            });
            return res.status(200).json({sections});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"})
        }
    },
    uploadAssignment: async(req,res)=>{
        try {
            const {sectionId , subject } = req.query ;
            const {description, deadline} =req.body ;
            const teacherId = req.userId ;
            const subjectId = await Subject.findOne({name: subject});
            if(req.file.size>2*1024*1024)
            {
                return res.status(400).json({message:"file size should be less than 2mb."});
            }
            // if(req.file.mimetype!="application/pdf")
            // {
            //     return res.status(400).json({message:"file type not allowed."});
            // }
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudinaryResponse = await uploadOnCloudinary(dataURI);
            const assignment = new Assignment({
                subject : subjectId,
                assignment : cloudinaryResponse.secure_url,
                section : sectionId ,
                teacher : teacherId,
                description: description,
                deadline: deadline
            });
            await assignment.save() ;
            return res.status(200).json({ message : "Assignment uploaded successfully"});
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    markAttendance: async(req,res)=>{
        try{
            const {roll,subjectCode,lectureNo,date,attended}=req.body;
            const student=await Student.findOne({universityRollNumber:roll});
            if(!student)
            {
                return res.status(404).json({message:"student doesnt exist"});
            }
            const subject=await Subject.findOne({code:subjectCode});
            if(!subject)
            {
                return res.status(404).json({message:"subject doesnt exist"});
            }
            const existingAttendance=await Attendance.findOne({student:student._id,subject:subject._id,lectureNo,date});
            if(existingAttendance)
            {
                await Attendance.findOneAndUpdate({student:student._id,subject:subject._id,lectureNo,date},{attended});
                return res.status(200).json({message:"attendance updated successfully"});
            }
            const teacherId=req.userId;
            const attendance=new Attendance({
                student:student._id,
                subject:subject._id,
                lectureNo,
                date,
                attended,
                markedBy:teacherId
            });
            await attendance.save();
            return res.status(200).json({message:"attendance marked successfully"});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"});
        }
    },
    getNotes : async (req , res ) =>  {
        try {
            const teacherId = req.userId;
            const notes = await ClassNotes.find({ teacher: teacherId })
                .populate({
                    path: 'section',
                    select: 'sectionName batch semester'
                })
                .populate({
                    path: 'subject',
                    select: 'name code subjectType' 
                })
                .select('-teacher'); 
            return res.status(200).json(notes);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getAssignments : async (req,res )=> {
        try {
            const teacherId = req.userId ; 
            const assignments  = await Assignment.find({ teacher: teacherId }).populate({
                path : 'section',
                select : 'sectionName batch semester'
            }).populate({
                path : 'subject' , 
                select : 'name code subjecType'
            }).select('-teacher');

            return res.status(200).json(assignments) ; 
        } catch (err ) {
            console.log(err) ;
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getAssignmentSolutions : async (req, res ) => {
        try {
            const teacherId = req.userId;
    
            const assignments = await Assignment.find({ teacher: teacherId }).exec();
    
            if (!assignments.length) {
                return res.status(404).json({ message: "No assignments found for this teacher." });
            }
    
            const assignmentIds = assignments.map(assignment => assignment._id);
    
            const assignmentSolutions = await AssignmentSolution.find({ assignmentId: { $in: assignmentIds } })
                .populate('student', 'name') 
                .populate('assignmentId', 'assignment') 
                .exec();
    
            if (!assignmentSolutions.length) {
                return res.status(404).json({ message: "No solutions found for the assignments." });
            }
    
            return res.status(200).json({ assignmentSolutions });
    
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports=teacherController