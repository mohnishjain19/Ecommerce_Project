const express=require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getsingleUser, deleteuser, updateUser, updateUserRole } = require("../controllers/userController");
const { isAuthentcatedUser, authorizeRoles } = require("../middleware/auth");
const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthentcatedUser,getUserDetails);
router.route("/password/update").put(isAuthentcatedUser,updatePassword);
router.route("/me/update").put(isAuthentcatedUser,updateProfile);
router.route("/admin/users").get(isAuthentcatedUser,authorizeRoles("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthentcatedUser,authorizeRoles("admin"),getsingleUser);
router.route("/admin/user/:id").put(isAuthentcatedUser,authorizeRoles("admin"),updateUserRole);
router.route("/admin/user/:id").delete(isAuthentcatedUser,authorizeRoles("admin"),deleteuser);
 
module.exports=router;      