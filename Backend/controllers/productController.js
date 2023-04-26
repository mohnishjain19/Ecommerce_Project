const Product =require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors =require("../middleware/catchAsyncErrors");
const Apifeatures=require("../utils/apifeatures");
const cloudinary=require("cloudinary");

// Create Route -- ADMIN
exports.createProduct =catchAsyncErrors(async(req,res,next)=>
{


    let images = JSON.parse(req.body.images);
     const imagesLink=[];

     for(let x=0;x<images.length;x++)
     {
        const result = await cloudinary.v2.uploader.upload(images[x].data,{
            folder:"products",  
        })
        imagesLink.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
     }
    req.body.images=imagesLink;
    req.body.user=req.user.id;
    

     const product =await Product.create(req.body);
     res.status(201).json({
        success:true,
        product
     })
});


//Get all Product
exports.getAllProducts = catchAsyncErrors(async(req,res,next)=>
{
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeature = new Apifeatures(Product.find(), req.query).search().filter()
   

    let product1=await apiFeature.query;
    let filteredProductsCount=product1.length;

    const apiFeature1= new Apifeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

    const product =await apiFeature1.query;
//    console.log(product); 
    res.status(200).json({
      success: true,
      product,
      productCount,
      resultPerPage,
      filteredProductsCount,
      
    });
  });


  //Get all Product ADMIN
exports.getAdminProducts = catchAsyncErrors(async(req,res,next)=>
{
    const products=await Product.find()
   
    res.status(200).json({
      success: true,
      products,
    });
  });

// Get product Details
exports.getProductDetails =catchAsyncErrors(async(req,res,next)=>
{
    let product;
    try
    {
        product = await Product.findById(req.params.id);
    }
    catch(err){
        console.log(err);
    }
    
   
    // console.log(product);
    if(!product){
        // return res.status(505).json({
        //     success:false,
        //     message:"Product Not found"
        // })
        return next(new ErrorHandler("Product Not Found",404));
        // return next(new ErrorHandler("Product Not Found",404));
    }
    res.status(200).json({
        success:true,
        product
    });
     
});


//Update a Product --ADMIN
exports.updateProduct =catchAsyncErrors(async(req,res,next) =>
{
    let product;
    try
    {
        // product = await Product.find({_id:req.params.id});
        product= await Product.findById(req.params.id);
    }
    catch(err)
    {
        console.log(err);
    }
    if(!product)
    {
        return res.status(500).json({
            success:false,
            message:"Product Not found"
        })
    }

    //Images start here
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    if (images !== undefined) {
        //  console.log(product.images.length);
        // console.log(images.length);
    //   Deleting Images From Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
  
      const imagesLinks = [];
  
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.images = imagesLinks;
    }


    product =await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,runValidators:true,useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product  
    })
});

//Delete a Product
exports.deleteProduct =catchAsyncErrors(async(req,res,next) =>{

    let product;
    try
    {
        product= await Product.findById(req.params.id);
    } 
    catch(error)
    {
        console.log(error);
    }
    if(!product)
    {
        return res.status(500).json({
            success:false,
            message:"Product Not found"
        })
    }
//Deleting images from cloudinary
for(let x=0;x<product.images.length;x++)
{
    await cloudinary.v2.uploader.destroy(product.images[x].public_id);
}

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Product deleted Successfully"  
    })

});

//Create new Review or  Update the review
exports.createProductReview =catchAsyncErrors(async (req,res,next)=>{

    const{rating,comment,productId} =req.body;
    const review ={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };  
    const product =await Product.findById(productId);
    const isReviewed =product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if(isReviewed)
    {
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
            {
                rev.rating=rating,
                rev.comment=comment
            }
        })
    }
    else
    {
        product.reviews.push(review);
        product.numofReviews =product.reviews.length
    }

    let avg=0;
    product.reviews.forEach((rev)=>{
        avg=avg+rev.rating;  
    })
    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    })
});

//Get All Reviews of a product

exports.getProductReviews =catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.id);

    if(!product)
    {
        return next(new ErrorHandler("Prodcut Not Found",404));
    }
    res.status(200).json({
        success:true,
         reviews:product.reviews,
    })
})

//Delete Review
exports.deleteReviews =catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product)
    {
        return next(new ErrorHandler("Prodcut Not Found",404));
    }

    const reviews =product.reviews.filter((rev) =>rev._id.toString()!= req.query.id.toString())

    let avg=0;
    reviews.forEach((rev)=>{
        avg=avg+rev.rating;  
    })
    let ratings=0;
    if(reviews.length===0)
    {
        ratings=0;
    }
    else
     ratings=avg/reviews.length;

    const numofReviews=reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    }
    )

    res.status(200).json({
        success:true,
    })
});
