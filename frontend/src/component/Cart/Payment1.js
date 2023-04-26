import React, { Fragment } from 'react'
import Payment from "./Payment"
import { useState,useEffect } from 'react';
import axios from 'axios'
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js"
import NotFound from '../layout/Not Found/NotFound';


const Payment1 = () => {
    // const [stripeApiKey,setStripeApiKey]=useState("");
    // async function getStripeApikey()
    // {
    //   const {data} =await axios.get("/api/v1/sendStripeApiKey");
    //   setStripeApiKey(data.stripeApiKey);
    // }
    // React.useEffect(()=>{
    //     getStripeApikey();
    //     },[])
    const [name, setName] = React.useState('');

    // Load the user's name from localStorage when the component mounts
    React.useEffect(() => {
      const storedName = localStorage.getItem('Accepted');
      if (storedName) {
        setName(storedName);
      }
    }, []);
  return (
    <Fragment>
        {/* <Elements stripe={loadStripe(stripeApiKey)}> */}
          {name==="accepted"?<Payment/>:<NotFound /> }
        {/* </Elements> */}

    </Fragment>
   
   

  )
}

export default Payment1