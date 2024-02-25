const mongoose=require("mongoose")


const examSchema=mongoose.Schema({
    examName:{
        type:String,
        require: true
    },
    semester:{
        type:Number,
        require: true
    },
    batch:{
        type:String,
        require:true
    }
})

module.exports=mongoose.model("Exam",examSchema);