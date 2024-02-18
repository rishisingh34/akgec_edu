const mongoose=require("mongoose");

const examTimetableSchema=mongoose.Schema({
    batch:{
        type:String,
        require:true,
        unique: true
    },
    examTimetableUrl:{
        type:String,
        require:true
    }
})

module.exports=mongoose.model("ExamTimetable",examTimetableSchema);