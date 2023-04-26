const express=require("express");
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrders, deleteOrder } = require("../controllers/orderController");
const router =express.Router();
const {isAuthentcatedUser,authorizeRoles}=require("../middleware/auth"); 


router.route("/order/new").post(isAuthentcatedUser,newOrder);
router.route("/order/:id").get(isAuthentcatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthentcatedUser,myOrders);
router.route("/admin/orders").get(isAuthentcatedUser,authorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthentcatedUser,authorizeRoles("admin"),updateOrders).delete(isAuthentcatedUser,authorizeRoles("admin"),deleteOrder);

module.exports=router;
