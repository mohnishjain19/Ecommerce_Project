const express=require("express");

// const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");
const router =express.Router();
const { checkout, paymentVerification, getkey } = require("../controllers/paymentController");

const {isAuthentcatedUser}=require("../middleware/auth");


// router.route("/payment/process").post(isAuthentcatedUser,processPayment);
// router.route("/stripeapikey").get(isAuthentcatedUser,sendStripeApiKey);

router.route("/payment/process").post(isAuthentcatedUser,checkout)
router.route("/paymentVerification").post(isAuthentcatedUser,paymentVerification)
router.route("/getKey").get(isAuthentcatedUser,getkey)



module.exports=router;