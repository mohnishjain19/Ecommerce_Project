const mongoose=require('mongoose');


// 2lUnSLbRzhES2BpK
// process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}\

const connectDatabase =() =>{
    
mongoose.connect("mongodb+srv://Ecommerce:2lUnSLbRzhES2BpK@cluster0.rsttsir.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true}).then((data)=>{

    console.log(`MongoDb connected with server : ${data.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
};
module.exports=connectDatabase;
