import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import "./payment.css";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const payBtn = useRef(null);
  const history=useNavigate();
  // const searchQuery=useSearchParams()[0];
  // const reference=searchQuery.get("reference");
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order1 = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data:{key} } = await axios.get(
        "/api/v1/getKey",
      );

      const { data:{order} } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const options = {
        key, 
        amount: order.amount,
        currency: "INR",
        name: "MOHNISH JAIN",
        description: "Test Transaction",
        image: "",
        order_id: order.id,
        // callback_url: "/api/v1/paymentVerification",
        prefill: {
            name: user.name,
            email:user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#121212"
        },
        handler: async function (response) {
          console.log(response);
          const d1=response.razorpay_payment_id;
          await axios.post('/api/v1/paymentVerification',response,config)
            .then(response => {
              // console.log(response.status);
              order1.paymentInfo = {
                id:d1,
                status:response.status,
              };
              // console.log(order1);
              dispatch(createOrder(order1));
              history("/success");
            })
            .catch(error => {
              alert.error(error.response.data.message);
            });
        }
    };
    const  razor = new window.Razorpay(options);
     razor.open();

    }
    catch(error)
    {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }


   
  };

  useEffect(() => {
     localStorage.removeItem('Accepted');
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>


          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
         
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;