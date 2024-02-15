const Student = require("../models/student.model"); 
const Token = require("../middlewares/token.middleware");
const Attendance = require("../models/attendance.model") ;
const Event=require("../models/event.model");
const Assignment=require("../models/assignment.model");
const AssignedSubject=require("../models/assignedSubject.model");
const Timetable=require("../models/timetable.model");
const mongoose= require("mongoose");
const {ObjectId}=mongoose.Types;

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
        }
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
      const assignment=await Assignment.find({section: student.section}).populate({path:'subject',select:'-_id'}).populate({path:'teacher',select:'-_id'}).select('-_id').select('-section');
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
  subject: async (req,res) =>{
    try
    {
      const studentId=req.userId;
      const subject=await AssignedSubject.findOne({student:studentId}).populate('subject');
      return res.status(200).json({subject:subject.subject});
    }
    catch(err)
    {
      return res.status(500).json({message:"Internal Server error."});
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
  }
};

module.exports = studentController;