const mongoose=require('mongoose');

const timetableSchema=mongoose.Schema({
    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        require:true
    },
    timetableUrl:{
        type:String,
        require:true
    }
})

module.exports=mongoose.model("Timetable",timetableSchema);