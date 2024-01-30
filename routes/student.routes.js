const router = require("express").Router();
const studentController = require("../controllers/student.controller");

router.post("/login", studentController.login);
router.get("/attendance", studentController.getAttendance)

module.exports = router;