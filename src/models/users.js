const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('../models/tasks')




const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        require:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            if(value.includes('password')){
                throw new Error("Password can't be password")
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer
    }
    
},{
    timestamps:true
})



userSchema.pre('save', async function (next) {
    const user=this
   

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }


    next()
    
})

userSchema.pre('remove',async function (next){
    const user =this
    await Task.deleteMany({owner:user._id})

    next()
})

    findByCredentials = async (email,password)=>{

    const user= await User.findOne( {email} )
   
    if(!user){
        throw new Error("unable to find user")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("password doesn't match")
    }
    return user 
}

  userSchema.methods.generateAuthToken = async function (){
      
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    user.save()
    return token
}
userSchema.virtual('userTasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function (){
    user=this
    userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}






User =mongoose.model('users',userSchema)

module.exports=User,findByCredentials

