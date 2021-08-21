const express=require('express')
require('./db/mongoose')

const userRouter=require('../src/routers/user')
const taskRouter=require('../src/routers/task')

const port=process.env.PORT

const app=express()

app.use(express.json())

// app.use((req,res,next)=>{
//     if(req.method=='GET'){
//         res.send("get is disabled")
//     }
//     next()
// })

app.use(userRouter)

app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is running on '+port)

    
})



// const main=  async function(){
//     // const task=await Task.findById('60f4826bc6b3b3303443d491')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user=await User.findById('60fc27c0153534081cf0432a')
//     await user.populate('userTasks').execPopulate()
//     console.log(user.userTasks)
// }
// main()