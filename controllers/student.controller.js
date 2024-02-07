const Student = require("../models/student.model"); 
const Token = require("../middlewares/token.middleware");
const Attendance = require("../models/attendance.model") ;
const Subject=require("../models/subject.model")
const Event=require("../models/event.model");
const Assignment=require("../models/assignment.model");
const AssignedSubject=require("../models/assignedSubject.model");

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
      const studentId = req.userId ;
      const attendance = await Attendance.find({student : studentId }).populate('subject') ;
      return res.status(200).json({ attendance });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  assignment : async (req,res)=>{
    try{
      const studentId=req.userId;
      const student=await Student.findOne({_id:studentId});
      const assignment=await Assignment.find({section: student.section, semester: student.semester}).populate('subject');
      res.status(200).json({assignment});
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  event: async (req,res)=>{
    try{
      const event=await Event.find();
      res.status(200).json({event});
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  },
  subject: async (req,res) =>{
    const studentId=req.userId;
    const subject=await AssignedSubject.findOne({student:studentId}).populate('subject');
    res.status(200).json({subject:subject.subject});
  }
};

module.exports = studentController;