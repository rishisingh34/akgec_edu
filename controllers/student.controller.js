const Student = require("../models/student.model"); 
const Token = require("../middlewares/token.middleware");
const Attendance = require("../models/attendance.model") ;
const Subject=require("../models/subject.model")

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
      const studentId = req.studentId ;
      const attendance = await Attendance.find({student : studentId }).populate('subject') ;
      return res.status(200).json({ attendance });
    } catch (err) {
      console.log(err) ;
      return res.status(500).json({message : "Internal Server Error"}); 
    }
  }
};

module.exports = studentController;