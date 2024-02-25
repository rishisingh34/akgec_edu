const multer = require("multer");

const storage = multer.memoryStorage({});
const upload = {
    documents: multer({ storage: storage, limits: {
        fileSize: 200*1024
    }}).single('document'),
    file: multer({ storage: storage, limits: {
        fileSize: 1024*1024
    }}).single('document')
}

const uploadDocs={ 
    documents: (req,res,next)=>{
        upload.documents(req,res, function(err) {
            if(err){
                return res.status(400).json({message:"File size limit exceeded."})
            }
            if(req.file.mimetype!="image/jpeg" && req.file.mimetype!="image/png" && req.file.mimetype!="application/pdf")
            {
                return res.status(400).json({message:"File type not allowed"})
            }
            next();
        })
    },
    file: (req,res,next)=>{
        upload.file(req,res, function(err) {
            if(err){
                return res.status(400).json({message:"File size limit exceeded."})
            }
            if(req.file.mimetype!="application/pdf")
            {
                return res.status(400).json({message:"File type not allowed"})
            }
            next();
        })
    }
}

module.exports = uploadDocs;