const mongoose=require('mongoose')


mongoose.connect(process.env.MONGO_SECRET,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false

})





// user1=new User({
//     name:'mir araf hossain',
//     email:"zaivsguitar@gmail.com",
//     password:'kiram123'
// })

// user1.save().then(()=>{
//     console.log(user1)
// }).catch((error)=>{
//     console.log('error!!!',error)
// })