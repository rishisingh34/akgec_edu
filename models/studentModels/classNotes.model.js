const mongoose=require('mongoose');

const classNotesSchema=mongoose.Schema({
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        require:true
    },
    classNotes:{
        type:String,
        require:true
    },
    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        require:true
    },
    teacher:{
        type:mongoose.Schema.ObjectId,
        ref:"Teacher",
    }
})

module.exports=mongoose.model("ClassNote",classNotesSchema);
