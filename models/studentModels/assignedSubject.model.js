const mongoose=require('mongoose');

const assignedSubjectSchema=mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        require:true
    },
    subject:[{
        subject : {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Subject',
            require:true
        },
        teacher :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Teacher',
            require:true
        },
    }],
})

module.exports=mongoose.model("AssignedSubject",assignedSubjectSchema);