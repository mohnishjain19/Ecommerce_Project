const User=require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors =require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto =require("crypto");
const cloudinary=require("cloudinary"); 
//Register a User
exports.registerUser =catchAsyncErrors(async(req,res,next)=>
{
    const mycloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    });
    const {name,email,password} =req.body;

     const user =await User.create({
        name,email,password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
     });

    //  const token=user.getJWTToken();
    //  res.status(201).json({
    //     success:true,
    //     token
    //  });
    sendToken(user,201,res);
}); 

// Login User
exports.loginUser =catchAsyncErrors(async(req,res,next)=>
{

    const {email,password} =req.body;

    //checking if email and password is given both
    if(!email || !password)
    {
        return next(new ErrorHandler("Please Enter Email & password",400));
    }

    const user=await User.findOne({email}).select("+password");
    if(!user)
    {
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    // const token=user.getJWTToken();

    //  res.status(200).json({
    //     success:true,
    //     token
    //  });
     sendToken(user,200,res);//Sending to utils jwttoken
});

//logout a user
exports.logout =catchAsyncErrors(async(req,res,next)=>
{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,   
        message:"Logged Out",
    });
});


//Forgot Password
exports.forgotPassword =catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user)
    {
        return next(new ErrorHandler("User not found",404));   
    }
    //Get resetPassword token
    const resetToken    = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    // const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    // const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf ypu have not requested this email then ,please ignore it`
    try
    {
            await sendEmail({
                email:user.email,
                subject:`Ecommerce Password Recovery`,
                message
            });
            res.status(200).json({
                success:true,
                message:`Email send to ${user.email} successfully`,
            })
    }
    catch(err)
    {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(err.message,500));
    }
    
})

//RESET PASSWORD
exports.resetPassword=catchAsyncErrors(async (req,res,next)=>{

    //Creating token hash
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user)
    {
        return next(new ErrorHandler("Reset Password token is invalid or has been expired",404));   
    }

    if(req.body.password!=req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password not match",400));
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

});

//Get user Details
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>
{

    const user =await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });

});


//Update User Password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>
{

    const user =await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !=req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password does not match",404));
    }
     
    user.password=req.body.newPassword;

    await user.save();
     
    sendToken(user,200,res);

});

//Update User Details
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>
{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
    } 

    //Wee will add cloudinary later
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
      
          newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,    
          };
        }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
     
    
    res.status(200).json({
        success:true,
    })
});


//Get All users (admin)
exports.getAllUsers =catchAsyncErrors(async(req,res,next)=>{

    const users=await User.find();
    
    res.status(200).json({
        success:true,
        users
    })
})

//get single user(admin)
exports.getsingleUser =catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }
    
    res.status(200).json({
        success:true,
        user
    })
})

//Update User Role(Admin)
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>
{
    const newUserDate ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    } 
   
    user=await User.findByIdAndUpdate(req.params.id,newUserDate,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
     
    
    res.status(200).json({
        success:true
    })
});

//Delete User --Admin
exports.deleteuser=catchAsyncErrors(async(req,res,next)=>
{
   
    const user=await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User does not exist with id ${req.params.id}`))
    }
     
    const imageId = user.avatar.public_id;
    
    await cloudinary.v2.uploader.destroy(imageId);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:"User deleted Successfully",
    })
});

