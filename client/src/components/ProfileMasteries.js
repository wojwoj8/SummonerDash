import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import { useEffect } from 'react';
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
  } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
import 'react-circular-progressbar/dist/styles.css';

const ProfileMasteries = (props) =>{

    const {masteries,
        setLastGamesWinratio, lastGamesWinratio} = props
    // console.log(masteries)
    // console.log(typeof(masteries))
    // console.log(masteries.length)

    const calcWintare = () =>{
        //total without remake because remake is neither win or lose
        const total = lastGamesWinratio.Victory + lastGamesWinratio.Defeat;
        let winrate = Math.ceil((lastGamesWinratio.Victory / total)*100);
        if (isNaN(winrate)){
            winrate = 0;
        }

        return winrate;
    }
    useEffect(() =>{
        calcWintare()
    },[lastGamesWinratio])

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

    const lostColor = 'rgb(14, 15, 22)';
    const victoryColor = 'rgba(34, 242, 76, 0.545)';
    
    const pieChartStyles = {
        
        background: `radial-gradient(closest-side, ${lostColor} 79%, transparent 80% 100%), conic-gradient(${victoryColor} 12%, ${lostColor} 0)`
      };
    return(
        
        
        <div className="profile-masteries-wrapper">
            {(typeof masteries[0] === 'undefined') ? (
                <div>
                   
                    {Array.isArray(masteries) ? <p>No data</p> : 
                    <div id="loading">
                        <Icon path={mdiLoading} size={2} spin />
                    </div> 
                }
                </div>
                
                
                // somehow make if array is empty display none
                // <p>loading....</p>
            ): (
                
                <div className="profile-masteries">
                    {/* {console.log(masteries.length)} */}
                    
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
                    <div className='masterie-lastGames'>
                    {lastGamesWinratio.Remake + lastGamesWinratio.Victory + lastGamesWinratio.Defeat !== 0 ? (
                        <div className='masterie-lastGamesData'>
                        {/* <h2>Last {lastGamesWinratio.Remake + lastGamesWinratio.Victory + lastGamesWinratio.Defeat} games</h2> */}
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
                    ) : (
                        <div className='masterie-nolastGamesData'>
                            <h2>No games found</h2>
                        </div>
                        
                    )}
                    

                </div>
                
                </div>
            )}
            
        </div>
                
    )
}
export default ProfileMasteries;

