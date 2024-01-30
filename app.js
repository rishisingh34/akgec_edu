const express = require('express') ; 
const app = express() ;
const { PORT } = require('./config/env.config') ;
const connectDB = require('./config/db.config');
const handleCors = require("./config/cors.config");
const cookieParser = require('cookie-parser') ;
const {sendMail} = require('./utils/mailer.util') ;

const studentRoutes = require('./routes/student.routes') ;

app.use(cookieParser()) ;
app.use(express.json()) ;
app.use(handleCors);
connectDB() ;

app.use('/v1/student', studentRoutes) ;
app.post('/sendMail', async (req, res) => {
  try {
    const {name, email } = req.body ;
    sendMail(email , name) ;
    res.status(200).json({message : 'Mail Sent'}) ;
  }catch(err) {
    console.log(err) ;

  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})