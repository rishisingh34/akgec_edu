require('dotenv').config() ;

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/database_akgec", 
  ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET ,
  EMAIL : process.env.EMAIL ,
  PASS : process.env.PASS ,
};

