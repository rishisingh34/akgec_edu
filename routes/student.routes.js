const router = require("express").Router();
const studentController = require("../controllers/student.controller");

router.post("/login", studentController.login);

module.exports = router;