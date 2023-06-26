import Game from "./Game";
import { useEffect, useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

const ProfileGames = (props) =>{

    const {games, userData, fetchedGamesStart, display, setDisplay, 
        button, setButton, rateMess, setRateMess, setCoolDown, cooldown, 
        setSeconds, seconds, lastGamesWinratio, setLastGamesWinratio, role, setRole} = props;
    // console.log(games)



        
    
    const startCooldown = () =>{
        setCoolDown(true)
        setSeconds(120)
    }
    const handleLoad = (e) =>{
        props.fetchMoreGamesData();
        setDisplay('none')
        console.log('loading')
        
    }

    useEffect(() => {
        if (rateMess === "Rate limit exceeded") {
          startCooldown();
        }
      }, [rateMess]);


    useEffect(() =>{

            if (cooldown && seconds > 0){

                const intervalId = setInterval(() => {
                    setSeconds(seconds => seconds - 1);
                  }, 1000)
                    return () => clearInterval(intervalId);   
            }   
            else if (cooldown && seconds === 0) {
                    setCoolDown(false);
                    setRateMess("");
                    // for loading bug if no game after fetch
                    setDisplay("block");

                if (typeof games === "object" && Object.keys(games).length === 0){
                        console.log('test 41')
                        //auto fetch next data after cooldown
                        handleLoad();
                    }
                }

    }, [cooldown, seconds])


    useEffect(() =>{
        setDisplay('block')
    }, [fetchedGamesStart])

    // if games object is array and array is empty
    if (Array.isArray(games) && games.length === 0){
        return(
            <div className="profile-games-wrapper">
                    <div className="profile-game">
                        <div className="profile-no-games-found">
                            {/* {console.log(54)} */}
                            <p>No games found</p>
                        </div>
                        
                    </div>
            </div>
            
        )
        // console.log('no games')
    }

    if (typeof games === "object" && Object.keys(games).length === 0) {
        return (
            <div className="profile-games-wrapper">
                    
                    {rateMess === "Rate limit exceeded" ? (
                        
                        <div className="fetchMore-wrapper">
                            <div className="profile-game">
                                <div className="profile-no-games-found">
                           
                                    <p>{rateMess}, try again in {seconds}s</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-games-loading" id="loading">
                            {console.log("45 loading --- while no games")}
                            <Icon id="load" path={mdiLoading} size={2} spin/>
                        </div>
                    )}
                        
                        
                   
                </div>
        );
      }

    
    
    return (
        <div className="profile-games-wrapper">
                
                {games.map((game) =>(
                    <div className={`profile-game`} key={game.info.gameId}>
                        {/* {console.log(game.info.gameId)} */}
                        <Game
                            userData={userData}
                            game={game}
                            setLastGamesWinratio={setLastGamesWinratio}
                            lastGamesWinratio={lastGamesWinratio}
                            fetchedGamesStart={fetchedGamesStart}
                            role={role}
                            setRole={setRole}
                        />
                    </div>
                ))}

                
            
            {button === false ? (
            <div className="fetchMore-wrapper">
                
                {rateMess !== "Rate limit exceeded" ?(
            <div className="fetchMore">
                <button className="button" style={{display: display}} onClick={handleLoad}>Load more</button>
                {display === 'none' && 
                <div id="loading">
                    {console.log("85 loading")}
                    <Icon path={mdiLoading} size={2} spin />
                </div>
                }
            </div>
            ):(
                <div className="profile-games-wrapper">
                    <div className="profile-game">
                        <div className="profile-no-games-found">
                            {rateMess === "Rate limit exceeded" ? (
                                <div>
                                    
                                    <p>{rateMess}, try again in {seconds}s</p>
                                </div>
                                
                            ) : (
                                <p>No more games found</p>
                            )}
                            {/* <p>No more games found</p> */}
                        </div>
                        
                    </div>
                </div>
            )}
            </div>) : (
                <div className="profile-games-wrapper">
                    
                <div className="profile-games-loading" id="loading">
                    {console.log("109 loading")}
                    <Icon id="load" path={mdiLoading} size={2} spin/>
                </div>
                
           
        </div>
            )}
            
        </div>
        
    )
}

export default ProfileGames;