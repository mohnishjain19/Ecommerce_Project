const catchAsyncErrors=require("../middleware/catchAsyncErrors");

// const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY);  
// const instance =require("../server.js");


const dotenv=require("dotenv");
const Razorpay=require("razorpay");
const crypto=require("crypto");
dotenv.config({path:"backend/config/config.env"});
const Payment =require("../models/paymentModel");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET,
  });

// exports.processPayment=catchAsyncErrors(async(req,res,next)=>{
//         const myPayment=await stripe.paymentIntents.create({
//             amount:req.body.amount,
//             currency:"inr",
//             metadata:{
//                 company:"Ecommerce",
//             },
//         });
//         res.status(200).json({
//             success:true,
//             client_secret:myPayment.client_secret 
//         })

// }); 



// exports.sendStripeApiKey=catchAsyncErrors(async(req,res,next)=>{
   
//     res.status(200).json({

//        stripeApiKey:process.env.STRIPE_API_KEY,
//     })

// }); 


exports.checkout =catchAsyncErrors(async (req,res,next)=>{

    const  options = {
        amount: Number(req.body.amount),  // amount in the smallest currency unit
        currency: "INR",
      };
      const order =await instance.orders.create(options);


      res.status(200).json({
        success:true,
        order


      })
});



exports.paymentVerification  =catchAsyncErrors(async (req,res,next)=>{

    const {razorpay_order_id,razorpay_payment_id, razorpay_signature }=req.body;

    const  body=razorpay_order_id + "|" + razorpay_payment_id;

    const  expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
                                    console.log("sig received " ,razorpay_signature);
                                    console.log("sig generated " ,expectedSignature);


    const isAuthentic =expectedSignature===razorpay_signature;
    
    if(isAuthentic){
     
      await Payment.create(({
        razorpay_order_id,razorpay_payment_id, razorpay_signature
      }))
      res.status(200).json({
        success:true,
        client_secret:razorpay_payment_id
      })
      // res.redirect(`/success?reference=${razorpay_payment_id}`);
    }
    else
    {
      res.status(200).json({
        success:false,
      })
    }

  
});

exports.getkey =catchAsyncErrors(async(req,res,next)=>{

    res.status(200).json({
      key:process.env.RAZORPAY_API_KEY
    })
})


