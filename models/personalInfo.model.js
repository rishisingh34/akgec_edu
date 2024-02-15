const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  name : {
    type : String, 
    required : true
  },
  gender : {
    type : String ,
  },
  dob : {
    type : String ,
  },
  courseName : {
    type : String ,
  },
  admissionDate : {
    type : String ,
  },
  branch : {
    type : String ,
  },
  semester : {  
    type : Number ,
  },
  admissionMode : {
    type : String 
  },
  section : {
    type : String 
  },
  category : {
    type : String 
  },
  domicileState : {
    type : String 
  },
  jeeRank : {
    type : String 
  },
  jeeRollNo : {
    type : String 
  },
  lateralEntry : {
    type : String 
  },
  hostel : {
    type : String 
  }
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);