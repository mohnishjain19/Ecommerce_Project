const ErrorHandler =require("../utils/errorhander");

module.exports=async (err,req,res,next)=>
{
        err.statusCode =err.statusCode || 500;
        err.message =err.message || "Internal Server Error";

        //Wrong Mongodb Id error
        if(err.name === "CastError")
        {
            const message =`Resource not found. Invalid: ${err.path}`;
            err= new ErrorHandler(message,400);
        }

        //Moongodb duplicate error key
        if(err.code===11000)
        {
            const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
            err=new ErrorHandler(message,400);
        }

        //Wrong JWT Error
        if(err.name === "JsonWebTokenError")
        {
                const message =`Json Web token is invalid, try again`;
                err= new ErrorHandler(message,400);
        }
        
        //JWT Expire Error
        if(err.name === "TokenExpiredError")
        {
                 const message =`Json Web token is Expired, try again`;
                 err= new ErrorHandler(message,400);
        }
         
        res.status(err.statusCode).json({
            success:false,
            error:err.message,
        });
}; 