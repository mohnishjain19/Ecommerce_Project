import React, { Fragment,useState,useEffect} from 'react'
import Loader from "../layout/Loader/Loader.js"
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import "./ForgotPassword.css"
import {useSelector,useDispatch} from "react-redux";
import { clearErrors,forgotPassword} from '../../actions/userAction.js';
import {useAlert} from "react-alert";
import { useNavigate } from 'react-router-dom';
import MetaData from "../layout/MetaData.js";


const ForgotPassword = () => {
    const dispatch=useDispatch();
    
    const {message,loading,error}=useSelector(state=>state.forgotPassword);
    const alert=useAlert();

    const [email,setEmail]=useState("");
    
    const forgotPasswordSubmit =(e)=>{
            e.preventDefault();
            dispatch(forgotPassword(email));
    }
    
    useEffect (()=>{
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(message)
        {
            alert.success(message);
          
        }
    },[dispatch,alert,error,message]);

  return (
    <Fragment>
        {loading?<Loader />:
        <Fragment>
        <MetaData title="Forgot Password" />
        <div className='forgotPasswordContainer'>
        <div className='forgotPasswordBox'>
        <h2 className="forgotPasswordHeading">Forgot Password</h2>
        <form className="forgotPasswordForm"  onSubmit={forgotPasswordSubmit}>
                <div className="forgotPasswordEmail">
                <MailOutlineIcon />
                <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
               
                <input type="submit" value="Send" className="forgotPasswordBtn" />
          </form>

         </div>
        </div>
        </Fragment>
            
        }
        </Fragment>
  )
}

export default ForgotPassword