const mongoose = require('mongoose') ;

const guardianInfoSchema = new mongoose.Schema({
  fatherName : {
    type : String 
  },
  motherName : {
    type : String 
  },
  fatherMobNo : {
    type : String 
  },
  motherMobNo : {
    type : String 
  },
  emailFather  : {
    type : String ,
  },
  emailMother : {
    type : String 
  },
  aadharNoFather : {
    type : String 
  },
  aadharNoMother : {
    type : String 
  },
  occupationFather : {
    type : String ,
  },
  occupationMother : {
    type : String 
  },
  address : {
    type : String 
  }
});

module.exports = mongoose.model("GuardianInfo", guardianInfoSchema);