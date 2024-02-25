const router=require("express").Router();
const teacherController=require("../controllers/teacher.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/login",teacherController.login);
router.get("/sectionStudents", auth , teacherController.sectionStudents);
router.post("/uploadNotes", auth, upload.file, teacherController.uploadNotes);

module.exports=router;