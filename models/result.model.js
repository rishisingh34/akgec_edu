const mongoose=require("mongoose")

const resultSchema=mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    exam:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    },
    maximumMarks:{
        type: Number
    },
    marksObtained:{
        type: Number
    }
})

module.exports=mongoose.model("Result",resultSchema);