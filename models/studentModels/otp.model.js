const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    user:{
        type: String,
        required: true
    },
    expires:{
        type: Date,
        required: true,
        default: Date.now()+600000
    }
})

module.exports = mongoose.model("Otp", otpSchema);