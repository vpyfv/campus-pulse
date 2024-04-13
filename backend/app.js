const express = require('express');
const app = express();

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS")
  next();
})

app.use('/api/posts',(req,res,next)=>{
  res.status(200).json({
    message:"this is fetched data",
  })
})

module.exports = app;
