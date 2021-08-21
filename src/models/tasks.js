const mongoose=require('mongoose')


const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId ,
        required:true,
        ref:"users"
    }

},{
    timestamps:true
})

Task=mongoose.model('tasks',taskSchema)

module.exports=Task