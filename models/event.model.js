const mongoose=require('mongoose');

const eventSchema=mongoose.Schema({
    hostingOrganization:{
        type:String,
        require:true
    },
    eventName:{
        type:String,
        require:true
    },
    date:{
        type:String
    },
    event:{
        type:String
    },
    registrationUrl:{
        type:String
    },
    detail:{
        type:String
    }
})

module.exports=mongoose.model("Event",eventSchema);