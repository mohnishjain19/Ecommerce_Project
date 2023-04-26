import React, { Fragment,useState,useEffect} from 'react'
import Loader from "../layout/Loader/Loader.js"
import "./ResetPassword.css"
import {useSelector,useDispatch} from "react-redux";
import { clearErrors,resetPassword} from '../../actions/userAction.js';
import {useAlert} from "react-alert";
import { useNavigate } from 'react-router-dom';
import MetaData from "../layout/MetaData.js";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useParams } from 'react-router-dom';


const ResetPassword = () => {
 
    const dispatch=useDispatch();
    const {success,loading,error}=useSelector(state=>state.forgotPassword);
    const history=useNavigate();
    const alert=useAlert();

    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const id1=useParams();
    const resetPasswordSubmit =(e)=>{
        e.preventDefault();
        const myForm =new FormData();
        myForm.set("password",password);
        myForm.set("confirmPassword",confirmPassword);
       dispatch(resetPassword(id1.token,myForm)); 
        
    }
    useEffect (()=>{
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(success)
        {
            alert.success("Password Updated Successfully");
            history("/login");
        }
    },[dispatch,alert,error,history,success]);




  return (
    <Fragment>
    {loading?<Loader />:
    <Fragment>
    <MetaData title="RESET PASSWORD" />
    <div className='resetPasswordContainer'>
    <div className='resetPasswordBox'>
    <h2 className="resetPasswordHeading">Change Password</h2>
    <form className="resetPasswordForm"  onSubmit={resetPasswordSubmit}>
                <div>
                <LockOpenIcon />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <div >
                <LockIcon />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>


            <input type="submit" value="Update" className="resetPasswordBtn" />
      </form>

     </div>
    </div>
    </Fragment>
        
    }
    </Fragment>
  )
}

export default ResetPassword