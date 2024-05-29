const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://150.50.1.50:5173",
    "https://edumarshal-web.vercel.app",
    "http://192.168.137.1:5173",
    "https://edumarshal-web-theta.vercel.app"
  ],
  // origin : '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

const handleCors = cors(corsOptions);

module.exports = handleCors;
