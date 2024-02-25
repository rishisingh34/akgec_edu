const mongoose=require("mongoose")

const assignmentSolutionSchema=mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        require: true
    },
    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment",
        require: true
    },
    solution:{
        type:String,
        require: true
    }
})

module.exports=mongoose.model("AssignmentSolution",assignmentSolutionSchema);