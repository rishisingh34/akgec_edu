const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
  email : {
    type : String ,
  },
  mobNo : {
    type : String 
  },
  alternateEmail : {
    type : String 
  },
  alternateMobNo : {
    type : String 
  },
  permanentAddress : {
    type : String 
  }, 
  presentAddress : {
    type : String 
  },
  permanentPincode : {
    type : String 
  },
  presentPincode : {
    type : String 
  },
  permanentState : {
    type : String 
  },
  presentState : {
    type : String 
  },
  permanentCountry : {
    type : String , 
  }, 
  presentCountry : {
    type : String 
  }
});

module.exports = mongoose.model("contactDetails", contactDetailsSchema); 