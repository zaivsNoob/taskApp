const express=require('express')
const router=new express.Router()
const Task=require('../models/tasks')
const auth=require('../middleware/auth')







router.post('/tasks',auth, async (req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
   
    try {
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

    // task.save().then(()=>{
    //     res.send(task)
    // })
})

// get /task?completed=true

router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}
  
    // console.log(req.user)
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==="desc"?-1:1
    }
    
    try {
        //const tasks=await Task.find({})
        await req.user.populate({
            path:'userTasks',
            match,//filter
            options:{
                limit:parseInt(req.query.limit),//pagination
                skip:parseInt(req.query.skip),
                sort

                
            }
        }).execPopulate()
         
        res.send(req.user.userTasks)
    } catch (e) {
        res.status(500).send(e)
    }

    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth,(req,res)=>{
    const _id=req.params.id


    Task.findOne({_id,owner:req.user._id}).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e)=>{
        res.status(500).send(e)
    })


})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const updates=Object.keys(req.body)
   const allowedupdates=['description','completed']
   const isValidUpdate=updates.every((update)=>allowedupdates.includes(update))
   if(!isValidUpdate){
       return res.status(400).send()
   }
  
    try {
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        const task= await Task.findOne({_id:req.params.id,owner:req.user._id})
        
        if(!task){
           return res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id',auth, async (req,res)=>{
    try {
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router