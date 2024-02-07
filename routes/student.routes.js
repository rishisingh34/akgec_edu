const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const auth  = require("../middlewares/auth.middleware");

router.post("/login", studentController.login);
router.get("/attendance", auth,  studentController.attendance);
router.get("/assignment", auth, studentController.assignment);
router.get("/event",studentController.event);
router.get("/subject",auth,studentController.subject);

module.exports = router;