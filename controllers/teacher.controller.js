const Teacher=require("../models/teacherModels/teacher.model")
const Subject=require("../models/studentModels/subject.model")
const Section=require("../models/studentModels/section.model")
const Token=require("../middlewares/token.middleware")
const Assignment=require("../models/studentModels/assignment.model")
const uploadOnCloudinary=require("../utils/cloudinary.util")

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
    },
    sectionSubject: async(req,res)=>{
        try{
            const teacherId=req.userId;
            const data=await Teacher.findOne({_id:teacherId}).populate({path:'subjectSection.section',select:'-student'}).populate({path:'subjectSection.subject',select:'-_id'}).select(['subjectSection','-_id']);
            const sections = data.subjectSection.map(item => { 
                return {
                    section: {
                        sectionId: item.section._id,
                        sectionName: item.section.sectionName,
                        semester: item.section.semester,
                        batch: item.section.batch
                        
                    },
                    subject: {
                        name: item.subject.name,
                        code: item.subject.code
                    }
                };
            });
            return res.status(200).json({sections});
        }
        catch(err)
        {
            return res.status(500).json({message:"internal server error"})
        }
    },
    uploadAssignment: async(req,res)=>{
        try {
            const {sectionId , subject } = req.query ;
            const {description, deadline} =req.body ;
            const teacherId = req.userId ;
            const subjectId = await Subject.findOne({name: subject});
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudinaryResponse = await uploadOnCloudinary(dataURI);
            const assignment = new Assignment({
                subject : subjectId,
                assignment : cloudinaryResponse.secure_url,
                section : sectionId ,
                teacher : teacherId,
                description: description,
                deadline: deadline
            });
            await assignment.save() ;
            return res.status(200).json({ message : "Assignment uploaded successfully"});
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports=teacherController