import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from './component/layout/Footer/Footer.js';
import {BrowserRouter as Router,Routes,Route,Switch} from "react-router-dom"
import Webfont from "webfontloader";
import React, { useState } from 'react';
import Home from "./component/Home/Home.js"
import ProductDetails from './component/Product/ProductDetails';
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from "./component/User/LoginSignUp.js"
import store from "./store";
import {loadUser, updateProfile, updateUser} from "./actions/userAction"
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js";
import Shipping from './component/Cart/Shipping'
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from 'axios';
import '@stripe/react-stripe-js'
import Payment1 from "./component/Cart/Payment1.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrder.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from "./component/admin/NewProduct"
import UpdateProduct from "./component/admin/UpdateProduct"
import OrderList from "./component/admin/OrderList.js"
import ProcessOrder from "./component/admin/ProcessOrder.js"
import UserList from "./component/admin/UserList.js"
import updateUser1 from "./component/admin/updateUser1.js"
import ProductReviews from "./component/admin/ProductReviews.js"
import Contact from "./component/layout/Contact/contact"
import About from "./component/layout/About/About"
import NotFound from "./component/layout/Not Found/NotFound";

function App()
 {

  const {isAuthenticated,user}=useSelector(state=>state.user);
  const [apiKey,setApiKey]=useState("");

  async function getApikey()
  {
    const {data} =await axios.get("/api/v1/getKey");
      setApiKey(data.key);
  }
  // console.log(window.location.pathname);

  React.useEffect(()=>{
    Webfont.load({
      google:{ 
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })
    store.dispatch(loadUser());
     getApikey();
    },[])
    
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    // console.log(apiKey);
  return (
    <Router> 
      <Header/>
      {isAuthenticated && <UserOptions user={user} />}
    <Routes>
          <Route exact path="/" Component={Home}/>
         <Route exact path="/product/:id" Component={ProductDetails}/>
         <Route exact path="/products" Component={Products}/>
         <Route  path="/products/:keyword" Component={Products} />
         <Route exact path="/search" Component={Search} />
         <Route exact path="/contact" Component={Contact} />
         <Route exact path="/about" Component={About} />
           <Route exact path="/login" Component={LoginSignUp} />


         {isAuthenticated?<Route exact path='/account' Component={Profile}/> :
         <Route exact path='/account' Component={LoginSignUp}/> }

         {isAuthenticated?<Route exact path='/me/update' Component={UpdateProfile}/> :
         <Route exact path='/me/update' Component={LoginSignUp}/> }

        <Route exact path='/password/forgot' Component={ForgotPassword}/>

        <Route exact path='/password/reset/:token' Component={ResetPassword}/>
          

         {isAuthenticated?<Route exact path='/password/update' Component={UpdatePassword}/> :
         <Route exact path='/password/update' Component={LoginSignUp}/> }

         <Route exact path="/cart" Component={Cart} />

         {isAuthenticated?<Route exact path='/shipping' Component={Shipping}/> :
         <Route exact path='
         /shipping' Component={LoginSignUp}/>}

          {isAuthenticated?<Route exact path='/order/confirm' Component={ConfirmOrder}/> :
         <Route exact path='/order/confirm' Component={LoginSignUp}/>}


         
         {isAuthenticated?<Route exact path='/process/payment' Component={Payment1}/> :
         <Route exact path='/proces/payment' Component={LoginSignUp}/>}

         {isAuthenticated?<Route exact path='/success' Component={OrderSuccess}/> :
         <Route exact path='/success' Component={LoginSignUp}/>}

         {isAuthenticated?<Route exact path='/orders' Component={MyOrders}/> :
         <Route exact path='/orders' Component={LoginSignUp}/>}

         {isAuthenticated?<Route exact path='/order/:id' Component={OrderDetails}/> :
         <Route exact path='/orders' Component={LoginSignUp}/>}

        
         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/dashboard' Component={Dashboard}/> :
         <Route exact path='/admin/dashboard' Component={LoginSignUp}/>}
         
         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/products' Component={ProductList}/> :
         <Route exact path='/admin/products' Component={LoginSignUp}/>}
       

         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/product' Component={NewProduct}/> :
         <Route exact path='/admin/product' Component={LoginSignUp}/>}

         
         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/product/:id' Component={UpdateProduct}/> :
         <Route exact path='/admin/product/:id' Component={LoginSignUp}/>}

         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/orders' Component={OrderList}/> :
         <Route exact path='/admin/orders' Component={LoginSignUp}/>}

         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/order/:id' Component={ProcessOrder}/> :
         <Route exact path='/admin/order/:id' Component={LoginSignUp}/>}


         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/users' Component={UserList}/> :
         <Route exact path='/admin/users' Component={LoginSignUp}/>}


         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/user/:id' Component={updateUser1}/> :
         <Route exact path='/admin/user/:id' Component={LoginSignUp}/>}

         {isAuthenticated &&  user.role==="admin" ?<Route exact path='/admin/reviews' Component={ProductReviews}/> :
         <Route exact path='/admin/reviews' Component={LoginSignUp}/>}

         <Route  path="*" Component={NotFound}/> 

         <Route Component ={
         window.location.pathname==="/process/payment"?null:NotFound
         }
         />

        </Routes>
        
       

      <Footer/>
    </Router>
    

  );
}

export default App;
