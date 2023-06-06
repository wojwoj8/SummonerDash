import {React, useState} from "react";
import { redirect, useNavigate } from "react-router-dom";

const StartPage = () => {
    // const search = handleSearch();
    

    const navigate = useNavigate();

    const navigateToProfile = (e) =>{
        navigate(e);
    }
    
    const handleSearch = (e) =>{
        e.preventDefault();
        const form = e.target.parentElement;
        const query = form.querySelector('#search-input').value;
        // console.log(query)
        // setData(query);
        
        navigateToProfile(`/name/${query}`)
    };

    return(

        <div className="App">
            <h1>Welcome at SummonerDash!!!</h1>
            <form id="search-form" method='GET'>
                <label htmlFor='search'>search</label>
                <input name="search" id="search-input" placeholder='Name'></input>
                <button type="submit" id="search-butt" onClick={e => handleSearch(e)}>Search!</button>
            </form>
        </div>
    )
}
export default StartPage;