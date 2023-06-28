import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import { useEffect, useState } from 'react';
import {
    CircularProgressbar,
    buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
import 'react-circular-progressbar/dist/styles.css';


import Top from'../images/ranked-positions/Position_Challenger-Top.png'
import Jun from'../images/ranked-positions/Position_Challenger-Jungle.png'
import Mid from'../images/ranked-positions/Position_Challenger-Mid.png'
import Bot from'../images/ranked-positions/Position_Challenger-Bot.png'
import Sup from'../images/ranked-positions/Position_Challenger-Support.png'
import ProgressBar from './ProgressBar';

const ProfileMasteries = (props) =>{

    const {masteries, lastGamesWinratio, role, display, button} = props

    const [totalRole, setTotalRole] = useState('');
    const calcWintare = () =>{
        //total without remake because remake is neither win or lose
        const total = lastGamesWinratio.Victory + lastGamesWinratio.Defeat;
        let winrate = Math.ceil((lastGamesWinratio.Victory / total)*100);
        if (isNaN(winrate)){
            winrate = 0;
        }

        return winrate;
    }
    
    const calcTotalGamesRole = (role) =>{
        let total = 0;
        for (const key in role){
            total += role[key];
          }
        
        return total
    }

    useEffect(() =>{
        calcWintare()
    },[lastGamesWinratio])

    useEffect(() =>{
        setTotalRole(calcTotalGamesRole(role))

    },[role])


    const calculateLastGame = (dataMs) =>{

        const currDate = Date.now();
        const gameCreation = dataMs
        const timeDifferenceInMs = currDate - gameCreation;

        const minutes = Math.floor((timeDifferenceInMs / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifferenceInMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24 * 30));

        let gameDate = "";
        
        if (months > 0) {
            gameDate = `${months} ${months === 1 ? 'month' : 'months'}`;
        } else if (days > 0) {
            gameDate = `${days} ${days === 1 ? 'day' : 'days'}`;
        } else if (hours > 0) {
            gameDate = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        } else if (minutes > 0) {
            gameDate = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        } else {
            gameDate = "a few moments";
        }

        return gameDate + ' ago'

    }

    return(
        
        
        <div className="profile-masteries-wrapper">
            {(typeof masteries[0] === 'undefined') ? (
                <div>
                    {Array.isArray(masteries) ? 
                    <div className='profile-masteries'>
                        <div className='profile-masteries-no-data'>
                            <p>No data after April 28, 2015</p> 
                        </div>
                        
                    </div>  
                    :
                    <div id="loading">
                        <Icon path={mdiLoading} size={2} spin />
                    </div> 
                }
                </div>
            ): (
                
                <div className="profile-masteries">
                    <div className="masterie-img-wrapper">
                    
                    {masteries.map((masterie, i) => (

                        <div className="masterie-img" key={i}>
                            <img src={masterie.squarePortraitPath} alt="masterieImg"></img>
                            <div className="masterie-img-data">
                                <p>{masterie.name}</p>
                                <p>Masterie Level: {masterie.championLevel}</p>
                                                {/* display , every 3 digits */}
                                <p>Total Points: {masterie.championPoints.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                                <p>Last Played: {calculateLastGame(masterie.lastPlayTime)}</p>
                           </div>
                           
                        </div>
                
                    
                ))}
                
                    
                    </div>
                    
                    {lastGamesWinratio.Remake + lastGamesWinratio.Victory + lastGamesWinratio.Defeat !== 0 ? (
                    <div className='masterie-lastGames'>
                        <div className='masterie-lastGamesData'>
                            <div className='masteries-wl-chart-wrapper'>
                                <div className='masteries-wl'>
                                    <p>{lastGamesWinratio.Victory + lastGamesWinratio.Defeat + lastGamesWinratio.Remake}G {lastGamesWinratio.Victory}W {lastGamesWinratio.Defeat}L
                                    </p>
      
                                </div>
                                
                                <div className='masterie-wrProgressBar'>
                                    <CircularProgressbar value={calcWintare()} text={`${calcWintare()}%`} 
                                        styles={buildStyles({
                                            textColor: "white",
                                            pathColor: "green",
                                            trailColor: "red"
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='masterie-roles'>

                            <div className='masterie-role'>
                                <div className='tooltip-container'>
                                    <ProgressBar fill={Math.ceil(role.TOP/totalRole *100)}/>
                                    <div className='tooltip-prof'>
                                        <p>{role.TOP}</p>
                                    </div>
                                </div>
                                <img src={Top} alt='top'></img>
                            </div>

                            <div className='masterie-role'>
                                <div className='tooltip-container'>
                                        <ProgressBar fill={Math.ceil(role.JUNGLE/totalRole *100)}/>  
                                    <div className='tooltip-prof'>
                                        <p>{role.JUNGLE}</p>
                                    </div>
                                </div>
                                <img src={Jun} alt='jungle'></img>
    
                            </div>
                                        
                            <div className='masterie-role'>
                                <div className='tooltip-container'>
                                    <ProgressBar fill={Math.ceil(role.MIDDLE/totalRole *100)}/>
                                    <div className='tooltip-prof'>
                                        <p>{role.MIDDLE}</p>
                                    </div>
                                </div>
                                <img src={Mid} alt='mid'></img>
                            </div>

                            <div className='masterie-role'>
                                <div className='tooltip-container'>
                                    <ProgressBar fill={Math.ceil(role.BOTTOM/totalRole *100)}/>
                                    <div className='tooltip-prof'>
                                        <p>{role.BOTTOM}</p>
                                    </div>
                                </div>
                                <img src={Bot} alt='bottom'></img>
                            </div>

                            <div className='masterie-role'>
                                <div className='tooltip-container'>
                                    <ProgressBar fill={Math.ceil(role.UTILITY/totalRole *100)}/>  
                                    <div className='tooltip-prof'>
                                        <p>{role.UTILITY}</p>
                                    </div>
                                </div>
                                <img src={Sup} alt='support'></img>
                            </div>
               
                        </div>
                    </div>
                        
                    ) : (
                        <div className='masterie-lastGames'>
                            {display === 'none' || button === true ? (
                                
                                <div className='masterie-nolastGamesData'>
                                    <h2>Loading...</h2>
                                </div>
                            ) : (
                                <div className='masterie-nolastGamesData'>
                                    <h2>No games data</h2>
                                </div>
                            )}
                            
                        </div>
                        
                    )}
                    

                </div>
                
               
            )}
            
        </div>
                
    )
}
export default ProfileMasteries;

