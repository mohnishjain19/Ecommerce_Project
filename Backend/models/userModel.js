const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your Name"],
        maxlength:[30,"Name cannot exceed 30 characters"],
        minlength:[4,"Name should have more than 4 charaters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter your Password"],
        minlength:[8,"Password should have more than 8 charaters"],
        select:false,
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    
    resetPasswordToken:String,
    resetPasswordExpire:Date,   
});

userSchema.pre("save",async function(next)
{
    if(!this.isModified('password'))
    {
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
}); 

//JWT Token
// Comparing Passport.js to JWT is akin to comparing apples to oranges as they both serve different goals; 
// The former is a middleware that handles authentication (login/logout) and the latter deals with authorisation (a JWT is generated after authentication 
// and is sent to the client, in which the client will return the JWT with each HTTP request to be validated to grant access to resources)

userSchema.methods.getJWTToken =function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//Comparing Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);

};

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken =function () {
    //Generating Token
    const resetToken=crypto.randomBytes(20).toString("hex");
    //Hashing and adding to user schema
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
//Expire in 15 minutes
    this.resetPasswordExpire=Date.now() + 15*60*1000;
    return resetToken;
};


module.exports=mongoose.model("User",userSchema);