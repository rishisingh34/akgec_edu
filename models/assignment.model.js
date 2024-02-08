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
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        require:true
    }
})

module.exports=mongoose.model("Assignment",assignmentSchema);
