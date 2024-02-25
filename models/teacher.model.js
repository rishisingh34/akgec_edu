const mongoose=require("mongoose")

const teacherSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    subjectSection:[{
        section:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        },
        subject:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subject"
        }
    }]
})

module.exports=mongoose.model("Teacher",teacherSchema);