const multer = require("multer");

const storage = multer.memoryStorage({});
const upload = multer({ storage: storage, limits: {
    fileSize: 200*1024
}}).single('document');

const uploadDocs=(req,res,next)=>{
    upload(req,res, function(err) {
        if(err){
            return res.status(400).json({message:"File size limit exceeded."})
        }
        if(req.file.mimetype!="image/jpeg" && req.file.mimetype!="image/png" && req.file.mimetype!="application/pdf")
        {
            return res.status(400).json({message:"File type not allowed"})
        }
        next();
    })
}

module.exports = uploadDocs;