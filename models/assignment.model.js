const mongoose=require('mongoose');

const assignmentSchema=mongoose.Schema({
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        require:true
    },
    assignment:{
        type:String,
        require:true
    },
    section:{
        type:String,
        require:true
    },
    semester:{
        type: Number
    }
})

module.exports=mongoose.model("Assignment",assignmentSchema);