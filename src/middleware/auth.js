const jwt=require('jsonwebtoken')
const User=require('../models/users')
require('mongoose')

const auth = async function (req,res,next) {
   
   try {
    const token=req.header('Authorization').replace("Bearer ","")
    
    
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    
    const user=await User.findOne({_id:decode._id,"tokens.token":token})
      

    
    
   
    

    if(!user){
        
        throw new Error()

    }
    req.token=token
    req.user=user
    
   
    next()
   

   } catch (e) {
       res.status(401).send('please authenticate')
   }

   
    
    
}
module.exports=auth 