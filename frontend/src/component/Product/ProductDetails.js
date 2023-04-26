import React, { Fragment, useEffect ,useState} from 'react'
import Carousel from "react-material-ui-carousel";
import Product from '../Home/ProductCard';
import "./ProductDetails.css";
import {useSelector,useDispatch} from "react-redux";
import { clearErrors, getProductDetails } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import ReviewCard from "./ReviewCard.js"
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";
import Metadata from '../layout/MetaData.js'
import {addItemsToCart} from "../../actions/cartActions";
import { newReview } from '../../actions/productAction';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

 const ProductDetails = () => {

  const dispatch=useDispatch();
  const alert=useAlert();
  const {product,loading,error}=useSelector(state=>state.productDetails)
  const {user}=useSelector(state=>state.user)
  const id1=useParams();
  const [quantity,setQuantity]=useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  const decreasequantity=()=>{
    if(quantity>=1)
    {
      const qty=quantity-1;
      setQuantity(qty);
    }
  }
  
  const increasequantity=()=>{
    if(product.Stock>quantity)
    { 
      const qty=quantity+1;
    setQuantity(qty);
    }
    
  }
  
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const addToCartHandler =() =>{
      dispatch(addItemsToCart(id1.id,quantity));
      alert.success("Item Added to Cart");
  }
  const {success,error:reviewError} =useSelector(state=>state.newReview)

  // const id1=useParams();
  //  console.log(id1.id);
  const reviewSubmitHandler =()=>{

    if(!user)
    {
      alert.error("Sign in to Enter Review");
    }
    else
    {
      
      const myForm=new FormData();
      myForm.set("rating",rating);
      myForm.set("comment",comment);
      myForm.set("productId",id1.id);

      dispatch(newReview(myForm));
    }

    setOpen(false);
  } 

  useEffect(()=>{
    window.scrollTo(0, 0);
    if(error)
    {
        alert.error(error);
        dispatch(clearErrors());
    }  
    if(reviewError)
    {
        alert.error(reviewError);
        dispatch(clearErrors());
    }  
    if(success)
    {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id1.id));


  },[dispatch,id1.id,error,alert,success]);

  const options={
    size:"large",
    value:product.ratings,
    readOnly:true,
    precision:0.5,
  }
  return (

    <Fragment>
        {loading?<Loader />: <Fragment>

        <Metadata  title={`${product.name} -- ECOMMERCE`} />
     <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                    <Rating {...options} />
                    <span>{product.numofReviews} Reviews</span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                    <div  className="detailsBlock-3.1"> 
                      <div className="detailsBlock-3.1.1">
                        <button onClick={decreasequantity}>-</button>
                        <input readOnly value={quantity} type="number" />
                        <button onClick={increasequantity}>+</button>
                      </div>
                      <button disabled={product.Stock<1?true:false} onClick={addToCartHandler}>Add to Cart</button>
                    </div>
                    <p>
                    Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                      </b>
                    </p>
              </div>
              <div className="detailsBlock-4" >
                      Descriptipn :<p>{product.description}</p>
              </div>

              <button className='submitReview' onClick={submitReviewToggle}>Submit Review</button>
      </div>

           
      </div>


                <h2 className='reviewsHeading'>REVIEWS</h2>

                      
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

                
                {product.reviews && product.reviews[0] ? (
                  <div className='reviews'>
                    {
                      product.reviews && product.reviews.map(review=> <ReviewCard review={review} />  )
                    }
                  </div> 
                ): <p
                  className="noReviews">No Reviews Yet
                </p>}

   </Fragment>}
    </Fragment>
  )
}


export default ProductDetails;
