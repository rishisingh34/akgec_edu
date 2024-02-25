const mongoose = require('mongoose');

const awardsAndAchievementsSchema = new mongoose.Schema({
  studentId : {
    type : String 
  },
  awardName : {
    type : String 
  },
  awardDescription : {
    type : String 
  },
  awardDate : {
    type : String 
  },
  awardImgUrl : {
    type : String 
  }
});

module.exports = mongoose.model("AwardsAndAchievements", awardsAndAchievementsSchema);