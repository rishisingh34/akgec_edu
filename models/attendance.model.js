const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  date : {
    type : String 
  },
  attendance : {
    type : Boolean,
    default : false
  },
  section : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  subject : {
    type : String 
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);