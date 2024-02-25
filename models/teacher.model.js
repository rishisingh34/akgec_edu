const mongoose=require("mongoose")

const teacherSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },
})

module.exports=mongoose.model("Teacher",teacherSchema);