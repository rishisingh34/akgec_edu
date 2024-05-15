const router=require("express").Router();
const teacherController=require("../controllers/teacher.controller");
const {auth} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/login",teacherController.login);
router.get("/sectionStudents", auth , teacherController.sectionStudents);
router.post("/uploadNotes", auth, upload.single('document'), teacherController.uploadNotes);
router.get("/sections",auth,teacherController.sectionSubject);
router.post("/uploadAssignment",auth,upload.single('document'),teacherController.uploadAssignment);

module.exports=router;