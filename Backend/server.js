const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/database");
const cloudinary=require("cloudinary");

//Unhandling Uncaught Exception
process.on("uncaught Exception",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    process.exit(1);
});



dotenv.config({path:"backend/config/config.env"});


//Config


connectDatabase();

 cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
 })

const server=app.listen(process.env.PORT,()=>{

    console.log(`Server is running on http://localhost:${process.env.PORT}`)
});

 
//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    // console.log('Error: ${err.message}`);
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});
