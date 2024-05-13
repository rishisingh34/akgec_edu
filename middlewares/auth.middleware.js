const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = require('../config/env.config') ;

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    req.userId = decoded.aud;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyResetPasswordToken=async(req,res,next)=>{
    const resetPasswordToken=req.cookies.resetPasswordToken;
    if(!resetPasswordToken)
    {
        return res.status(400).json({message:"bad request"})
    }
    try{
        const decoded=jwt.verify(resetPasswordToken,ACCESS_TOKEN_SECRET);
        req.user=decoded.aud;
        next();
    }
    catch(err)
    {
        return res.status(400).json({message:"please try again"})
    }
}
module.exports = {auth,verifyResetPasswordToken};

