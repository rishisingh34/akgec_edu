const Student = require("../models/studentModels/student.model"); 
const Token = require("../middlewares/token.middleware");
const Attendance = require("../models/studentModels/attendance.model") ;
const Event=require("../models/studentModels/event.model");
const Assignment=require("../models/studentModels/assignment.model");
const AssignedSubject=require("../models/studentModels/assignedSubject.model");
const Timetable=require("../models/studentModels/timetable.model");
const mongoose= require("mongoose");
const {ObjectId}=mongoose.Types;
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
  attendance : async (req,res ) => {
    try {
      const studentId = new ObjectId(req.userId) ;
     // const attendance = await Attendance.find({student : studentId }).populate('subject') ;
      const attendance = await Attendance.aggregate([
        { $match: { student: studentId } }, 
        { $lookup: { from: "subjects", localField: "subject", foreignField: "_id", as: "subjectDetails" } },
        { $unwind: "$subjectDetails" },
        { $sort: { date: 1 } },
        { $group: 
          { _id: "$subjectDetails", 
            totalClasses: { $sum: 1 }, 
            totalPresent: { 
              $sum: { 
                $cond: { 
                  if: { $or: [ "$attended", "$isAc" ] }, 
                  then: 1, 
                  else: 0 
                }
              }
            },
            attendance: { $push: "$$ROOT" } 
          } 
        }, 
        {
          $project:{
            subject: "$_id.name", 
            attendance: 1,
            totalClasses: 1,
            totalPresent: 1
          }
        },
        {
          $project: {
            _id: 0,
            "attendance._id": 0, 
            "attendance.student": 0, 
            "attendance.subject": 0,
            "attendance.subjectDetails":0,
          }
        },
        { $sort: { subject: 1 } }
      ]);
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
      const assignments=await Assignment.find({section: student.section}).populate({path:'subject',select:'-_id'}).populate({path:'teacher',select:'-_id'}).select('-section');
      const assignment = assignments.map(item => { 
        return {
          assignmentId: item._id,
          subject: {
              name: item.subject.name,
              code: item.subject.code
          },
          assignment: item.assignment,
          teacher: {
            name: item.teacher.name
          },
          deadline: item.deadline,
          description: item.description
        };
      });
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
      if (cloudinaryResponse.error || !cloudinaryResponse.secure_url) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }     
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
      const pdpAttendance = await Pdpattendance.aggregate([
        { $match: { student: studentId } }, 
        { $sort: { date: 1 } },
        { $group: 
          { _id: null, 
            totalClasses: { $sum: 1 }, 
            totalPresent: { 
              $sum: { 
                $cond: { 
                  if: { $or: [ "$attended", "$isAc" ] }, 
                  then: 1, 
                  else: 0 
                }
              }
            },
            attendance: { $push: {date:"$date",attended:"$attended",isAc:"$isAc"} } 
          } 
        }, 
        {
          $project:{ 
            _id: 0,
            attendance: 1,
            totalClasses: 1,
            totalPresent: 1
          }
        }
      ]);
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
      const result= await Result.aggregate([
        {$match: {student: studentId}},
        {$lookup: { from: "subjects", localField: "subject", foreignField: "_id", as: "subjectDetails" }},
        {$lookup: { from: "exams", localField: "exam", foreignField: "_id", as: "examDetails" }},
        {$unwind: "$subjectDetails"},
        {$unwind: "$examDetails"},
        {$group: {
          _id: "$examDetails",
          result: {$push: {subject: "$subjectDetails.name", maximumMarks:"$maximumMarks", marksObtained:"$marksObtained"}}
        }},
        {$project:{
          exam:"$_id.examName",
          result: 1,
          _id: 0
        }}
      ]);
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
      const classNote=await ClassNotes.find({section: student.section}).populate({path:'subject',select:'-_id'}).populate({path:'teacher',select:'-_id'}).select(['-_id','-section']);
      const classNotes = classNote.map(item => { 
        return {
          subject: {
              name: item.subject.name,
              code: item.subject.code
          },
          classnotes: item.classNotes,
          teacher: {
            name: item.teacher.name
          },
        };
      });
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
  }
};

module.exports = studentController;