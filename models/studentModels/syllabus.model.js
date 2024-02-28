const mongoose=require("mongoose")

const syllabusSchema=mongoose.Schema({
    semester:{
        type:Number
    },
    batch:{
        type:String
    },
    syllabus:{
        type:String
    }
})

module.exports=mongoose.model("Syllabus",syllabusSchema)