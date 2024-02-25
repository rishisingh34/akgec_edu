const Teacher=require("../models/teacherModels/teacher.model")
const Token=require("../middlewares/token.middleware")
const Section= require("../models/studentModels/section.model");
const Subject = require("../models/studentModels/subject.model");
const ClassNotes = require("../models/studentModels/classNotes.model");

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
    sectionStudents: async (req, res) => {
        try {           
            const section = await Section.findOne(req.query).populate({path : 'student', select : '-_id -dob -password -section -personalInfo -guardianInfo -contactDetails -educationalDetails -awardsAndAchievements'});      
            return res.status(200).json({ sectionName : section.sectionName, students : section.student, semester : section.semester, batch : section.batch});
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    uploadNotes : async (req, res) => {
        try {
            const {section , subject } = req.query ;
            const teacherId = req.userId ;
            const [sectionId, subjectId] = await Promise.all([
                Section.findOne({ sectionName: section }),
                Subject.findOne({ name : subject })
            ]);
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cloudinaryResponse = await uploadOnCloudinary(dataURI);
            const classNotes = new ClassNotes({
                subjectId,
                classNotes : cloudinaryResponse.secure_url,
                sectionId ,
                teacher : teacherId
            });
            await classNotes.save() ;
            return res.status(200).json({ message : "Notes uploaded successfully"});
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports=teacherController