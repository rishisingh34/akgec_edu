const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const auth  = require("../middlewares/auth.middleware");

router.post("/login", studentController.login);
router.get("/attendance", auth,  studentController.attendance);

module.exports = router;