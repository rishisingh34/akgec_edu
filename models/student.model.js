// create a student schema 
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  username : {
    type : String ,
    required : true , 
    unique : true ,
  }, 
  password : {
    type : String ,
    required : true , 
  },
  dob : {
    type : String ,
    required : true , 
  }
})

module.exports = mongoose.model("Student", studentSchema);