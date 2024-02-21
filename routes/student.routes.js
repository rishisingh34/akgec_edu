const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const auth  = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/login", studentController.login);
router.get("/attendance", auth,  studentController.attendance);
router.get("/assignment", auth, studentController.assignment);
router.get("/event",studentController.event);
router.get("/subject",auth,studentController.subject);
router.get("/timetable",auth,studentController.timetable);
router.get("/profile/personalInfo",auth,studentController.personalInfo);
router.get("/profile/contactDetails", auth, studentController.contactDetails);
router.get("/profile/parentInfo",auth,studentController.guardianInfo);
router.get("/profile/awards",auth,studentController.awardsAndAchievements);
router.get("/profile/documents",auth,studentController.documents);
router.post("/profile/document",auth,upload, studentController.uploadDocument);
router.get("/pdpattendance",auth,studentController.pdpAttendance);
router.get("/exam/timetable",auth,studentController.examTimetable);
router.get("/exam/result",auth,studentController.result);
router.get("/classNotes",auth,studentController.classNotes);

module.exports = router;