const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionName : {
    type : String 
  },
  student : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }],
  semester : {
    type : Number 
  },
  batch:{
    type:String
  }
});

module.exports = mongoose.model("Section", sectionSchema);