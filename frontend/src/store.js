import {createStore,combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import { newproductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, productsReducer, reviewReducer } from "./reducers/productReducer";
import { allUserreducer, forgotPasswordreducer, profileReducer, userDetailsreducer, userReducer } from "./reducers/userReducer.js";
import { cartReducer } from "./reducers/cartReducers";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer";


const reducer=combineReducers({
products:productsReducer,
productDetails:productDetailsReducer,
user:userReducer,
profile:profileReducer,
forgotPassword:forgotPasswordreducer,
cart:cartReducer,
newOrder: newOrderReducer,
myOrders:myOrdersReducer,
orderDetails:orderDetailsReducer,
newReview:newReviewReducer,
newProduct:newproductReducer,
product:productReducer,
allOrders:allOrdersReducer,
order:orderReducer,
allUsers:allUserreducer,
userDetails:userDetailsreducer,
productReviews:productReviewsReducer,
review:reviewReducer,
});


let initialstate={
    cart:{
        cartItems:localStorage.getItem("cartItems")?
        JSON.parse(localStorage.getItem("cartItems")):[],
        shippingInfo:localStorage.getItem("shippingInfo")?
        JSON.parse(localStorage.getItem("shippingInfo")):{},
    }
};
const middleware=[thunk];

const store=createStore(reducer,initialstate,composeWithDevTools(applyMiddleware(...middleware)));


export default store;
