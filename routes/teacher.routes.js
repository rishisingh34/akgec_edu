const router=require("express").Router();
const teacherController=require("../controllers/teacher.controller");
const {auth,verifyResetPasswordToken}  = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/login",teacherController.login);
router.get("/sectionStudents", auth , teacherController.sectionStudents);
router.post("/uploadNotes", auth, upload.single('document'), teacherController.uploadNotes);
router.get("/sections",auth,teacherController.sectionSubject);
router.post("/uploadAssignment",auth,upload.single('document'),teacherController.uploadAssignment);
router.post("/markAttendance",auth,teacherController.markAttendance);
router.get('/getAllAttendance', auth, teacherController.getAllAttendance); 
router.get("/getNotes",auth,teacherController.getNotes); 
// router.get('/getTimetable', auth , teacherController.getTimetable);
router.get('/getAssignments', auth , teacherController.getAssignments);
router.get('/getAssignmentSolutions', auth , teacherController.getAssignmentSolutions);
router.post("/resetPassword", teacherController.resetPassword);
router.post("/verifyOtp", teacherController.verifyOtp);
router.post("/setNewPassword",verifyResetPasswordToken, teacherController.setNewPassword);



module.exports=router;