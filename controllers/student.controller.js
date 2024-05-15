const Student = require("../models/studentModels/student.model"); 
const Token = require("../middlewares/token.middleware");
const Attendance = require("../models/studentModels/attendance.model") ;
const Event=require("../models/studentModels/event.model");
const Assignment=require("../models/studentModels/assignment.model");
const AssignedSubject=require("../models/studentModels/assignedSubject.model");
const Timetable=require("../models/studentModels/timetable.model");
const {ObjectId}=require("mongoose").Types;
const Subject = require("../models/studentModels/subject.model");
const Teacher = require("../models/teacherModels/teacher.model");
const Section = require("../models/studentModels/section.model");
const personalInfo = require("../models/studentModels/personalInfo.model");
const ContactDetails = require("../models/studentModels/contactDetail.model");
const GuardianInfo = require("../models/studentModels/guardianInfo.model");
const AwardsAndAchievements = require("../models/studentModels/awardsAndAchievements.model");
const Documents = require("../models/studentModels/document.model");
const uploadOnCloudinary=require("../utils/cloudinary.util")
const Pdpattendance=require("../models/studentModels/pdpattendance.model");
const Exam=require("../models/studentModels/exam.model")
const ExamTimetable=require("../models/studentModels/examTimetable.model");
const Result=require("../models/studentModels/result.model")
const ClassNotes=require("../models/studentModels/classNotes.model")
const AssignmentSolution=require("../models/studentModels/assignmentSolution.model")
const Feedback=require("../models/studentModels/feedback.model")
const pipelines=require("../utils/pipelines");
const Syllabus=require("../models/studentModels/syllabus.model")
const {sendMail}=require("../utils/mailer.util");
const Otp=require("../models/studentModels/otp.model");

const studentController = {
  login: async (req, res) => {
    try {
      const { username , password , dob  } = req.body;
      const student = await  Student.findOne({username}) ;
      if( !student ) {
        return res.status(404).json({ message : 'User not found' });
      }
      if( student.password != password || student.dob != dob ) {
        return res.status(400).json({ message : 'Invalid Credentials' });
      }
      const accessToken = await Token.signAccessToken(student.id);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }); 
      return res.status(200).json({ message: "Login Successful" , name : student.name });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  },
  resetPassword:async(req,res)=>{
    try{
        const {username}=req.body;
        const student=await Student.findOne({username:username}).populate({path:'contactDetails',select:'email -_id'});
        if(!student)
        {
            return res.status(404).json({message:"user not found"});
        }
        const otp=Math.floor(Math.random()*8999)+1000;
        await sendMail(otp,"Reset Password",student.name,student.contactDetails.email);
        const OTP=await Otp.findOne({user:username});
        if(OTP)
        {
            await Otp.findOneAndDelete({user:username});
        }
        const newOtp=new Otp({
            user:username,
            otp:otp,
            expires:Date.now()+600000
        })
        await newOtp.save();
        res.status(200).json({message:"otp sent successfully to your email"})
    }
    catch(err)
    {
        res.status(500).json({message:"internal server error"})
    }
  },
  verifyOtp:async(req,res)=>{
      try{
          const {username,otp}=req.body;
          const student=await Student.findOne({username:username});
          if(!student)
          {
              res.status(404).json({message:"User not found"});
              return;
          }
          const OTP=await Otp.findOne({user:username});
          if(OTP.expires<Date.now())
          {
              res.status(403).json({message:"OTP expired."});
              return;
          }
          if(OTP.otp!=otp)
          {
              res.status(400).json({message:"Incorrect otp."});
              return;
          }
          const resetPasswordToken=Token.signResetPasswordToken(student.id);
          res.cookie('resetPasswordToken',resetPasswordToken,{httpOnly:true,sameSite:'None',secure:true})
          return res.status(200).json({message:"otp verifies successfully"})
      }
      catch(err)
      {
          return res.status(500).json({message:"internal server error"});
      }
  },
  setNewPassword:async(req,res)=>{
      try{
          const {newPassword}=req.body;
          const studentId=req.user;
          await Student.findOneAndUpdate({_id:studentId},{password:newPassword});
          return res.status(200).json({message:"password reset successful."})
      }
      catch(err)
      {
          return res.status(500).json({message:"internal server error"});
      }
  },
  attendance : async (req,res ) => {
    try {
      const studentId = new ObjectId(req.userId) ;
      const attendance = await Attendance.aggregate(pipelines.attendancePipeline(studentId));
      return res.status(200).json(attendance);
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  assignment : async (req,res)=>{
    try{
      const studentId=req.userId;
      const student=await Student.findOne({_id:studentId});
      const assignment=await Assignment.find({section: student.section}).populate({path:'subject',select:'-_id'}).populate({path:'teacher',select:'name -_id'}).select(['-section','-__v']);
      return res.status(200).json({assignment});
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  event: async (req,res)=>{
    try{
      const event=await Event.find();
      return res.status(200).json({event});
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  subject: async (req, res) => {
    try {
        const studentId = req.userId;
        const subject = await AssignedSubject.findOne({ student: studentId })
            .populate({path:'subject', select:'-_id'}).select(['-_id','-student']);
          //  .populate('subjects.teacher', 'name -_id'); 
        
        // const subjects = assignedSubjects.subjects.map(item => {
        //     return {
        //         subject: item.subject,
        //         teacher: item.teacher.name 
        //     };
        // });

        return res.status(200).json(subject);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server error." });
    }
  },
  timetable: async(req,res) =>{
    try
    {
      const studentId=req.userId;
      const student=await Student.findOne({_id: studentId});
      const timetable=await Timetable.findOne({section: student.section});
      return res.status(200).json({timetable:timetable.timetableUrl});
    }
    catch(err){
      return res.status(500).json({message:"internal server error."});
    }
  },
  personalInfo : async (req, res) => {
    try {
      const studentId = req.userId;
      const studentPersonalInfo = await Student.findOne({ _id: studentId }).populate({path:'personalInfo',select:'-_id'});
      return res.status(200).json({ personalInfo :  studentPersonalInfo.personalInfo });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    } 
  },
  contactDetails : async (req, res) => {
    try {
      const studentId = req.userId;
      const studentContactDetails = await Student.findOne({ _id: studentId }).populate({path:'contactDetails',select:'-_id'});
      return res.status(200).json({ contactDetails :  studentContactDetails.contactDetails });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  guardianInfo : async (req, res) => {
    try {
      const studentId = req.userId;
      const studentGuardianInfo = await Student.findOne({ _id: studentId }).populate({path:'guardianInfo',select:'-_id'});
      return res.status(200).json({ parentsInfo : studentGuardianInfo.guardianInfo });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  awardsAndAchievements : async (req, res) => {
    try {
      const studentId = req.userId;
      const studentAwards = await Student.findOne({ _id: studentId }).populate({path:'awardsAndAchievements',select:'-_id'});
      return res.status(200).json({ awardsAndAchievements : studentAwards.awardsAndAchievements });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  documents : async (req, res) => {
    try {
      const studentId = req.userId;
      const documents = await Documents.findOne({ student: studentId }).select(['-_id','-student','-__v']);
      return res.status(200).json({ documents });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  uploadDocument : async (req, res) =>  {
    try {
      const documentType = req.query.documentType;
      const documents=["studentPhoto","aadharCard","tenthMarksheet","twelfthMarksheet","allotmentLetter","domicileCertificate","covidVaccinationCertificate","migrationCertificate","characterCertificate","casteCertificate","ewsCertificate","gapCertificate","incomeCertificate","medicalCertificate","seatAllotmentLetter"];
      if(!documents.includes(documentType))
      {
        return res.status(400).json({message:"document type invalid"});
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudinaryResponse = await uploadOnCloudinary(dataURI);    
      const studentId = req.userId;
      await Documents.findOneAndUpdate({ student: studentId }, { [documentType]: cloudinaryResponse.secure_url } , { upsert: true });
      return res.status(200).json({ message: "Document uploaded successfully" });
    } catch(err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  pdpAttendance: async(req,res)=>{
    try
    {
      const studentId = new ObjectId(req.userId) ;
      const pdpAttendance = await Pdpattendance.aggregate(pipelines.pdpAttendancePipeline(studentId));
      return res.status(200).json(pdpAttendance[0]);
    }
    catch(err)
    {
      return res.status(500).json({message:"internal server error"});
    }
  },
  examTimetable: async(req,res)=>{
    try
    {
      const studentId=req.userId;
      const student=await Student.findOne({_id: studentId}).populate('section');
      const examTimetable= await ExamTimetable.findOne({batch: student.section.batch}).select(["-_id","-batch"]);
      return res.status(200).json({examTimetable});
    }
    catch(err)
    {
      return res.status(500).json({message:"Internal Server error"});
    }
  },
  result: async(req,res)=>{
    try{
      const studentId=new ObjectId(req.userId);
      const result= await Result.aggregate(pipelines.resultPipeline(studentId));
      return res.status(200).json(result)
    }
    catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  classNotes : async (req,res)=>{
    try{
      const studentId=req.userId;
      const student=await Student.findOne({_id:studentId});
      const classNotes=await ClassNotes.find({section: student.section}).populate({path:'subject',select:'-_id'}).populate({path:'teacher',select:'name -_id'}).select(['-_id','-section','-__v']);
      return res.status(200).json({classNotes});
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  uploadAssignmentSolution : async (req,res)=>{
    try
    {
      const studentId=req.userId;
      const assignmentId=req.query.assignmentId;
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cloudinaryResponse = await uploadOnCloudinary(dataURI);
      const assignmentSolution=new AssignmentSolution({
        student: studentId,
        assignmentId: assignmentId,
        solution: cloudinaryResponse.secure_url
      })
      await assignmentSolution.save();
      return res.status(200).json({message:"assignment solution uploaded successfully."})
    }
    catch(err)
    {
      return res.status(500).json({message:"internal server error."});
    }
  },
  assignmentSolutions: async (req,res)=>{
    try{
      const studentId=req.userId;
      const assignmentSolutions=await AssignmentSolution.find({student: studentId}).select(['assignmentId','solution','-_id']);
      return res.status(200).json({assignmentSolutions});
    }
    catch(err)
    {
      return res.status(500).json({message:"internal server error."});
    }
  },
  feedback : async (req,res)=>{
    try {
      const studentId = req.userId;
      const { theorySubjectFeedbacks , labFeedbacks , labAssistantFeedbacks } = req.body;
      const feedback = new Feedback({ student: studentId, theorySubjectFeedbacks , labFeedbacks , labAssistantFeedbacks});  
      await feedback.save();
      return res.status(200).json({ message: "Feedback submitted successfully" });
    } catch(err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"});
    }
  },
  syllabus: async(req,res)=>{
    try{
      const studentId=req.userId;
      const student=await Student.findOne({_id:studentId}).populate('section');
      const syllabus=await Syllabus.findOne({semester: student.section.semester, batch: student.section.batch});
      res.status(200).json({syllabus});
    }
    catch(err)
    {
      res.status(500).json({message:"internal server error"});
    }
  }
};

module.exports = studentController;