const Teacher=require("../models/teacher.model")
const Token=require("../middlewares/token.middleware")

const teacherController={
    login: async(req,res)=>{
        try{
            const {email,password}=req.body;
            const teacher=await Teacher.findOne({email});
            if(!teacher)
            {
                return res.status(404).json({message:"user doesnt exist"})
            }
            if(teacher.password!=password)
            {
                return res.status(400).json({message:"invalid credentials."})
            }
            const accessToken=await Token.signAccessToken(teacher.id);
            res.cookie("accessToken",accessToken,{
                httpOnly:true,
                secure:true,
                sameSite:"none"
            })
            return res.status(200).json({message:"Login successful", name: teacher.name});
        }
        catch(err)
        {
            return res.staus(500).json({message:"internal server error"});
        }
    }
}

module.exports=teacherController