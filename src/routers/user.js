const express=require('express')
const multer=require('multer')
const sharp=require("sharp")
const router =new express.Router()
const User=require('../models/users')
const auth=require('../middleware/auth')








router.post('/users', async (req,res)=>{

    const user=new User(req.body)
    
   
    try {
        
        await user.save()
         
          const token= await user.generateAuthToken()
         
 
       

        
            res.send({user,token} )
    } catch (error) {
        res.status(400).send(error)
    }
 
 //    user.save().then(()=>{
 //        res.send(user)
 //    }).catch((e)=>{
 //        res.status(400)
 //        res.send(e)
 //    })
 })


 router.post('/users/login', async (req,res)=>{
 
     try {
        const user =await findByCredentials(req.body.email,req.body.password)
       
         const token =await user.generateAuthToken()
         
         res.send({user,token})
     } catch (e) {
         res.status(400).send()
     }
      
      
 })


 router.post('/users/logoutAll',auth,async(req,res)=>{
     try {
         req.user.tokens=[]
         await req.user.save()
     } catch (e) {
         res.status(500).send()
     }
 })

 router.post('/users/logout',auth,async (req,res)=>{

    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }

 })

 const upload=multer({
     
     limits:{
        fileSize:3000000
     },

     fileFilter(req,file,cb){
         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
             cb(new Error("please upload a picture"))
         }
         cb(undefined,true)
     }
     
 })

 router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
     //req.user.avatar=req.file.buffer
     const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
     req.user.avatar=buffer
    await req.user.save()
     res.send("file uploaded")
 },(error,req,res,next)=>{
     res.status(400).send({error:error.message})
 })

 router.delete('/users/me/avatar',auth,async(req,res)=>{
     req.user.avatar=undefined
    await req.user.save()
     res.send()
 })

 router.get('/users/:id/avatar',async (req,res)=>{

    try {
        const user=await User.findById(req.params.id)
     if(!user||!user.avatar){
         throw new Error()

     }
     res.set('Content-Type',"image/png")
     res.send(user.avatar)
        
    } catch (e) {
        
    }
     
 })

 
 router.get('/users/me',auth,async (req,res)=>{

        res.send(req.user)

    // try {
    //     const users=await User.find({})
    //     res.send(users)
        
    // } catch (e) {
    //     res.status(500).send(e)
        
    // }
 
    
    
 
 
    //  User.find({}).then((users)=>{
    //      res.send(users)
    //  }).catch((e)=>{
    //      res.status(500).send(e)
    //  })
 })
 
//  router.get('/users/:id',  (req,res)=>{
//      _id=req.params.id
 
     
//      // try {
//      //     const user= await User.findById(_id)
//      //     if(!user){
//      //         return res.status(404).send()
//      //     }
//      //     res.send(user)
//      // } catch (e) {
//      //     res.status(500).send(e)
//      // }
     
//      User.findById(_id).then((user)=>{
//          if(!user){
//              return res.status(404).send()
//          }
//          res.send(user)
//      }).catch((e)=>{
//          res.status(500).send()
//      })
//  })
 
 router.patch('/users/me',auth,async (req,res)=>{
     const updates=Object.keys(req.body)
     const allowedUpdates=['name','email','password']
     const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))
     if(!isValidUpdate){
         return res.status(400).send()
     }
 
     try {
        //  const user =await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        
        updates.forEach((update)=>req.user[update]=req.body[update])
         await req.user.save()



         if(!req.user){
             return res.status(400).send()
         }
         res.send(req.user)
     } catch (e) {
         res.status(500).send()
     }
 })
 
 router.delete('/users/me',auth, async (req,res)=>{
     try {
        //  const user=await User.findByIdAndDelete(req.user._id)
        //  if(!user){
        //      return res.status(404).send()
         await req.user.remove()
         
         res.send(user)
     } catch (e) {
         res.status(500).send()
     }
 })

 module.exports=router