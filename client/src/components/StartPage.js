import {React, useState} from "react";
import { redirect, useNavigate } from "react-router-dom";

const StartPage = () => {
    // const search = handleSearch();
    const [region, setRegion] = useState('eun1');

    const navigate = useNavigate();

    const navigateToProfile = (e) =>{
        navigate(e);
    }
    
    const handleSearch = (e) =>{
        e.preventDefault();
        const form = e.target.parentElement;
        const query = form.querySelector('#search-input').value;
        // const region = form.querySelector
        // console.log(query)
        // setData(query);
        
        navigateToProfile(`${region}/name/${query}`)
    };

    const handleRegion = (e) =>{
        const selectedId = e.target.options[e.target.selectedIndex].id;
        setRegion(selectedId);
    }
    return(

        <div className="App">
            <h1>Welcome at SummonerDash!!!</h1>
            <form id="search-form" method='GET'>
                <div>
                    <label htmlFor='region'>Select Region</label>
                    <select name='region' onChange={handleRegion}>
                        <option id='eun1'>Europe Nordic & East</option>
                        <option id='euw1'>Europe West</option>
                        <option id='na1'>North America</option>
                        <option id='br1'>Brazil</option>
                        <option id='jp1'>Japan</option>
                        <option id='kr'>Korea</option>
                        <option id='la1'>LAN</option>
                        <option id='la2'>LAS</option>
                        <option id='oc1'>Oceania</option>
                        <option id='tr1'>Turkey</option>
                        <option id='ru1'>Russia</option>
                        <option id='ph2'>Philippines</option>
                        <option id='sg2'>Singapore</option>
                        <option id='th2'>Taiwan</option>
                        <option id='tw2'>Vietnam</option>
                        <option id='vn2'>Thailand</option>
                    </select>
                    {/* <p>{region}</p> */}
                </div>
                <div>
                    <label htmlFor='search'>search</label>
                    <input name="search" id="search-input" placeholder='Name'></input>
                    <button type="submit" id="search-butt" onClick={e => handleSearch(e)}>Search!</button>
                </div>
            </form>
        </div>
    )
}
export default StartPage;