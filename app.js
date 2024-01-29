const express = require('express') ; 
const app = express() ;
const { PORT } = require('./config/env.config') ;
const connectDB = require('./config/db.config');
const handleCors = require("./config/cors.config");
const cookieParser = require('cookie-parser') ;

app.use(cookieParser()) ;
app.use(express.json()) ;
app.use(handleCors);
connectDB() ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})