const mongoose=require('mongoose');

const pdpattedanceSchema=mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    date:{
        type:String,
        require:true
    },
    attended:{
        type:Boolean,
        require:true,
        default:false
    },
    isAc:{
        type:Boolean,
        require:true,
        default:false
    }
})

module.exports=mongoose.model("Pdpattendance",pdpattedanceSchema);