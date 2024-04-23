const express =require('express');
const mongoose = require('mongoose');
const userRouter = require('./user/user_router')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()



mongoose.connect(
  process.env.MONGO_URL
).then(()=>{
  console.log("connected to mongoDB");
}).catch((_)=>{
  console.log("failed to connect to mongoDB");
});



const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials:true,
  origin:['http://localhost:4200']
}));
app.use('/api/user',userRouter)




module.exports = app;
