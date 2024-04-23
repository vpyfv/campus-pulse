const router = require('express').Router()
const bycrypt = require('bcryptjs');
const UserModel = require('./user_model')
const jwt = require('jsonwebtoken')


router.post('/signup', async (req, res, next) => {
  console.log(req.body);
  const salt = await bycrypt.genSalt(10);
  const hashPassword = await bycrypt.hash(String(req.body.password), salt);
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  const newUser= await user.save()
  const token = jwt.sign({_id:newUser._id},process.env.SECRET_KEY)
   res.cookie('jwt',token,{
    httpOnly:true,
    maxAge:24*60*60*1000
   })

  res.send(newUser);
});

router.post('/signin',async(req,res,next)=>{
  console.log("calling signin");
  const user = await UserModel.findOne({email:req.body.email});
  if(!user){
    return res.status(404).send({
      message:"user not found"
    })
  }
   if(! await bycrypt.compare(req.body.password,user.password)){
    return res.status(400).send({
      message:"invalid credentials"
    })
   }

   const token = jwt.sign({_id:user._id},process.env.SECRET_KEY)
   res.cookie('jwt',token,{
    httpOnly:true,
    maxAge:24*60*60*1000
   })
   
   res.send({
    message:"logged in"
   });
})

router.get('/',async (req,res,next)=>
{
  console.log("checking user");

  try {
    const cookie = req.cookies['jwt']
  const claims = jwt.verify(cookie,process.env.SECRET_KEY)
  if(!claims){
    res.status(401).send({
      message:"un authenticated"
    })
  }
  const user = await UserModel.findOne({_id:claims._id})
  const {password,...data} = user.toJSON()
  res.send(data)
  } catch (error) {
    res.status(401).send({
      message:"un authenticated"
    })
  }
  
})


router.post('/signout',(req,res,next)=>{
  console.log("signing out");
  res.cookie('jwt','',{maxAge:0})
  res.send({
    message:"success"
  })
})

module.exports = router
