const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type:String,
    required: true,
    unique: true
  },
  subjectType:{
    type:String,
    enum:["Theory","Lab"]
  }
});

module.exports = mongoose.model("Subject", subjectSchema);