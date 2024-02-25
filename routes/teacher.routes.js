const router=require("express").Router();
const teacherController=require("../controllers/teacher.controller");

router.post("/login",teacherController.login);

module.exports=router;