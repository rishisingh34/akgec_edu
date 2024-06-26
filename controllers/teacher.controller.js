const Teacher=require("../models/teacherModels/teacher.model")
const Subject=require("../models/studentModels/subject.model")
const Section=require("../models/studentModels/section.model")
const ClassNotes = require("../models/studentModels/classNotes.model");
const  uploadOnCloudinary = require("../utils/cloudinary.util");
const Assignment=require("../models/studentModels/assignment.model")
const Student=require("../models/studentModels/student.model")
const Attendance=require("../models/studentModels/attendance.model")
const AssignmentSolution = require('../models/studentModels/assignmentSolution.model') ;
const Otp = require('../models/studentModels/otp.model'); 
const {sendMail}=require("../utils/mailer.util");
const Token = require("../middlewares/token.middleware");

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
            const {sectionId , subject , description, deadline} = req.query ;
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
            const {roll,subjectCode,lectureNo,date,attended,isAc}=req.body;
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
                await Attendance.findOneAndUpdate({student:student._id,subject:subject._id,lectureNo,date},{attended,isAc});
                return res.status(200).json({message:"attendance updated successfully"});
            }
            const teacherId=req.userId;
            const attendance=new Attendance({
                student:student._id,
                subject:subject._id,
                lectureNo,
                date,
                attended,
                isAc,
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
                    select: 'sectionName batch semester -_id'
                })
                .populate({
                    path: 'subject',
                    select: 'name code -_id' 
                })
                .select('-teacher -__v -_id'); 
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
                select : 'sectionName batch semester -_id'
            }).populate({
                path : 'subject' , 
                select : 'name code subjecType -_id'
            }).select('-teacher -__v');

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
                .populate('student', 'name universityRollNumber studentNumber -_id')
                .populate('assignmentId', 'assignment')
                .exec();
    
            if (!assignmentSolutions.length) {
                return res.status(404).json({ message: "No solutions found for the assignments." });
            }
    
            const groupedSolutions = assignmentSolutions.reduce((acc, solution) => {
                const assignmentId = solution.assignmentId._id;
                if (!acc[assignmentId]) {
                    acc[assignmentId] = {
                        assignmentId,
                        assignment: solution.assignmentId.assignment,
                        solutions: []
                    };
                }
                acc[assignmentId].solutions.push({
                    student: solution.student,
                    solution: solution.solution
                });
                return acc;
            }, {});
    
            const result = Object.values(groupedSolutions);
    
            return res.status(200).json({ assignments: result });
    
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getAllAttendance : async ( req ,res ) => {
        try {
            const { sectionId, subjectCode } = req.query;
    
            const section = await Section.findById(sectionId).populate('student');
            if (!section) {
                return res.status(404).json({ message: "Section not found" });
            }
    
            const subject = await Subject.findOne({ code: subjectCode });
            if (!subject) {
                return res.status(404).json({ message: "Subject not found" });
            }
    
            const studentIds = section.student.map(student => student._id);
    
            const attendanceRecords = await Attendance.find({
                subject: subject._id,
                student: { $in: studentIds }
            }).populate('student', 'name universityRollNumber studentNumber -_id').select('-__v -subject -_id -markedBy');
    
            const groupedByDate = attendanceRecords.reduce((acc, record) => {
                const date = record.date;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(record);
                return acc;
            }, {});
    
            return res.status(200).json(groupedByDate);
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    resetPassword : async (req, res ) => {
        try {
            const { email } = req.body;
            const teacher = await Teacher.findOne({ email }).select('name email');
            
            if (!teacher) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const otp = Math.floor(Math.random() * 8999) + 1000;
            await sendMail(otp, "Reset Password", teacher.name, teacher.email);
    
            const existingOtp = await Otp.findOne({ user: email });
            if (existingOtp) {
                await Otp.findOneAndDelete({ user: email });
            }
    
            const newOtp = new Otp({
                user: email,
                otp: otp,
                expires: Date.now() + 600000 
            });
    
            await newOtp.save();
            res.status(200).json({ message: "OTP sent successfully to your email" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    verifyOtp : async (req, res) => {
        try {
            const { email, otp } = req.body;
            const teacher = await Teacher.findOne({ email });
            if (!teacher) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const OTP = await Otp.findOne({ user: email });
            if (!OTP) {
                return res.status(404).json({ message: "OTP not found" });
            }
    
            if (OTP.expires < Date.now()) {
                return res.status(403).json({ message: "OTP expired." });
            }
    
            if (OTP.otp != otp) {
                return res.status(400).json({ message: "Incorrect OTP." });
            }
    
            const resetPasswordToken = Token.signResetPasswordToken(teacher.id);
            res.cookie('resetPasswordToken', resetPasswordToken, { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(200).json({ message: "OTP verified successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    setNewPassword : async (req, res) => {
        try {
            const { newPassword } = req.body;
            const teacherId = req.user;            
            await Teacher.findOneAndUpdate({ _id: teacherId }, { password: newPassword });            
            return res.status(200).json({ message: "Password reset successful." });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports=teacherController