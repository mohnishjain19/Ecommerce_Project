import React, { Fragment } from 'react'
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { redirect } from 'react-router-dom';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({component:Component,...rest}) => {

    const {isAuthenticated,user,loading}=useSelector((state)=>state.user); 
    
  
  return(
         <Fragment>
            {!loading && (
                <Route
                    {...rest}
                    render ={(props)=>{
                        if(!isAuthenticated)
                        {
                            return <redirect to="/login" />;
                        }

                        return <Component {...props} />;
                    }}

                 />
            )} 
                    
        </Fragment>
        
  )};  

export default ProtectedRoute;