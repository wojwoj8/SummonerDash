import {React, useState} from "react";
import { redirect, useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

const StartPage = () => {
    // const search = handleSearch();
    const [region, setRegion] = useState({id: 'eun1', name: 'Europe Nordic & East'});
    const [button, setButton] = useState('false');
    const [query, setQuery] = useState("")
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
        navigateToProfile(`${region.id}/name/${query}`)
    };
    const hadleQuery = (value) =>{
        setQuery(value)
    }

    const handleButton = () =>{
        button === true ? setButton(false) : setButton(true)
    }
    const handleRegion = (id, name) =>{
        
        setRegion({id: id, name: name});
        handleButton();
    }


    return(

        <div className="startPage">
            <div className="startPage-title">
                <h1>Welcome at SummonerDash!!!</h1>
            </div>
            
            <div className="searchForm-container">
                <form id="search-form" method='GET'>
                    <div className="selectRegionWrapper">
                        <label htmlFor='region'>Region</label>
                            <div className="selected-region">
                                <button 
                                    id={region.id} 
                                    name={region.name}
                                    type="button"
                                    onClick={handleButton}
                                >
                                    {region.name}
                            
                                </button>
                            </div>
                        
                        {button === true &&
                            <div className="regions-list">
                            {regions.map((region) => (
                                <button
                                    key={region.id}
                                    id={region.id}
                                    onClick={() => handleRegion(region.id, region.name)}
                                    type="button"
                                >
                                    {region.name}
                                    
                                </button>
                            ))}
                        </div>}
                    </div>
                    <div className="right-side-search">
                        <div className="search">
                            <label htmlFor='search'>Search</label>
                            <input name="search" id="search-input" placeholder='Name' required value={query} onChange={e => setQuery(e.target.value)}></input>
                        
                        </div>
                        <button type="submit" id="search-butt" onClick={e => handleSearch(e)}><Icon path={mdiMagnify} size={1} /></button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}
export default StartPage;