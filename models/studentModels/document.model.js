const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  student : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Student"
  },
  studentPhoto : {
    type : String 
  },
  aadharCard : {
    type : String 
  },
  tenthMarksheet : {
    type : String 
  },
  twelfthMarksheet : {
    type : String 
  },
  allotmentLetter : {
    type : String 
  },
  domicileCertificate : {
    type : String 
  },
  covidVaccinationCertificate : {
    type : String 
  },
  migrationCertificate : {
    type : String 
  },
  characterCertificate : {
    type : String 
  },
  casteCertificate : {
    type : String 
  },
  ewsCertificate : {
    type : String 
  },
  gapCertificate : {
    type : String 
  },
  incomeCertificate : {
    type : String 
  },
  medicalCertificate : {
    type : String 
  },
  seatAllotmentLetter:{
    type: String
  }
});

module.exports = mongoose.model("Documents", documentsSchema);