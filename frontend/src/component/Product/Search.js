import React, { Fragment } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Search.css"
import Metadata from "../layout/MetaData.js"

const Search = () => {
    const history=useNavigate();
    const [keyword,setKeyword]=useState("");
    const searchSubmitHandler=(e)=>{
        e.preventDefault();
        if(keyword.trim())
        {
            history(`/products/${keyword}`)
        }
        else
        {
            history("/products");
        }

    }
  return (
    <Fragment>
        <Metadata  title="SEARCH A PRODUCT ---ECOMMERCE" />
        <form className='searchBox' onSubmit={searchSubmitHandler}>
        <input type="text"
        placeholder="Search a Product ..." 
        onChange={(e)=>setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" /> 

        </form>

    </Fragment>
  )
}

export default Search