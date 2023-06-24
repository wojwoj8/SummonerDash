import {React, useState, useRef, useEffect} from "react";
import { redirect, useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiMagnify, mdiRotate360 } from '@mdi/js';
import { mdiTriangleSmallDown } from '@mdi/js';
import Arrow from "../images/expandArrow.svg"

const StartPage = () => {
    // const search = handleSearch();
    const [region, setRegion] = useState({id: 'eun1', name: 'Europe Nordic & East'});
    
    const [query, setQuery] = useState("")
    document.title = "SummonerDash";

    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

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

    useEffect(() => {
        const handleClick = (event) => {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsExpanded(false);
          }
        };
    
        if (isExpanded) {
          document.addEventListener('click', handleClick);
        } else {
          document.removeEventListener('click', handleClick);
        }
    
        return () => {
          document.removeEventListener('click', handleClick);
        };
      }, [isExpanded]);
    

    const handleDivClick = () => {
        inputRef.current.focus();
    };

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const navigateToProfile = (e) =>{
        navigate(e);
    }
    
    const handleSearch = (e) =>{
        navigateToProfile(`${region.id}/name/${query}`)
    };



    const handleRegion = (id, name) =>{
        
        setRegion({id: id, name: name});
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
                            <div className={`selected-region ${isExpanded ? 'expanded' : ''}`}>
                                <button 
                                    id={region.id} 
                                    name={region.name}
                                    type="button"
                                    onClick={handleToggle}
                                    ref={containerRef}
                                >
                                    {region.name}

                                    <img src={Arrow} alt="expand"/>
                            
                                </button>
                                
                            </div>
                        
                        {isExpanded &&
                            <div className="regions-list" >
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
                        <div className="search" onClick={handleDivClick}>
                            <label htmlFor='search'>Search</label>
                            <input ref={inputRef} name="search" id="search-input" placeholder='Name' required value={query} onChange={e => setQuery(e.target.value)}></input>
                        
                        </div>
                        <button type="submit" id="search-butt" onClick={e => handleSearch(e)}><Icon path={mdiMagnify} size={1} /></button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}
export default StartPage;