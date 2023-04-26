const express=require("express");
const router =express.Router();
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReviews, getProductReviews, getAdminProducts} =require("../controllers/productController");
const {isAuthentcatedUser,authorizeRoles}=require("../middleware/auth"); 

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthentcatedUser,authorizeRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthentcatedUser,authorizeRoles("admin"),updateProduct)
router.route("/admin/product/:id").delete(isAuthentcatedUser,authorizeRoles("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthentcatedUser,createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthentcatedUser,deleteReviews);
router.route("/admin/products").get(isAuthentcatedUser,authorizeRoles("admin"),getAdminProducts);
 
module.exports=router;
