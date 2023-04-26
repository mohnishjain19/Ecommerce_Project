import React, { Fragment,useState,useEffect} from 'react'
import Loader from "../layout/Loader/Loader.js"
import "./UpdatePassword.css"
import {useSelector,useDispatch} from "react-redux";
import { clearErrors,updatePassword} from '../../actions/userAction.js';
import {useAlert} from "react-alert";
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants.js';
import MetaData from "../layout/MetaData.js";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";


const UpdatePassword = () => {

    const dispatch=useDispatch();
    
    const {isUpdated,loading,error}=useSelector(state=>state.profile);
    const history=useNavigate();
    const alert=useAlert();

    const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    const updatePasswordSubmit =(e)=>{
        e.preventDefault();
        const myForm =new FormData();
        myForm.set("oldPassword",oldPassword);
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword",confirmPassword);
       dispatch(updatePassword(myForm)); 
        
    }
    useEffect (()=>{
        if(error)
        {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isUpdated)
        {
            alert.success("Password Updated Successfully");
            dispatch({
                type:UPDATE_PASSWORD_RESET,
            })
        }
    },[dispatch,alert,error,history,isUpdated]);




  return (
    <Fragment>
    {loading?<Loader />:
    <Fragment>
    <MetaData title="Update Profile" />
    <div className='updatePasswordContainer'>
    <div className='updatePasswordBox'>
    <h2 className="updatePasswordHeading">Change Password</h2>
    <form className="updatePasswordForm"  onSubmit={updatePasswordSubmit}>
            <div className="signUpPassword">
                <VpnKeyIcon />
                <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                </div>

                <div className="signUpPassword">
                <LockOpenIcon />
                <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                </div>

                <div className="signUpPassword">
                <LockIcon />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>


            <input type="submit" value="Change" className="updatePasswordBtn" />
      </form>

     </div>
    </div>
    </Fragment>
        
    }
    </Fragment>
  )
}

export default UpdatePassword;