import {React, useState} from "react";
import { redirect, useNavigate } from "react-router-dom";

const StartPage = () => {
    // const search = handleSearch();
    const [region, setRegion] = useState('eun1');
    document.title = "SummonerDash";

    const navigate = useNavigate();

    const regions = [
        { id: 'eun1', name: 'Europe Nordic & East' },
        { id: 'euw1', name: 'Europe West' },
        { id: 'na1', name: 'North America' },
        { id: 'br1', name: 'Brazil' },
        { id: 'jp1', name: 'Japan' },
        { id: 'kr', name: 'Korea' },
        { id: 'la1', name: 'LAN' },
        { id: 'la2', name: 'LAS' },
        { id: 'oc1', name: 'Oceania' },
        { id: 'tr1', name: 'Turkey' },
        { id: 'ru1', name: 'Russia' },
        { id: 'ph2', name: 'Philippines' },
        { id: 'sg2', name: 'Singapore' },
        { id: 'th2', name: 'Taiwan' },
        { id: 'tw2', name: 'Vietnam' },
        { id: 'vn2', name: 'Thailand' },
    ];

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

        <div className="startPage">
            <div className="startPage-title">
                <h1>Welcome at SummonerDash!!!</h1>
            </div>
            
            <div className="searchForm-container">
                <form id="search-form" method='GET'>
                    <div className="selectRegion">
                        <label htmlFor='region'>Region</label>
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
                    </div>
                    <div className="search">
                        <label htmlFor='search'>Search</label>
                        <input name="search" id="search-input" placeholder='Name'></input>
                        <button type="submit" id="search-butt" onClick={e => handleSearch(e)}>Search!</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default StartPage;