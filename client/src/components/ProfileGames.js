import Game from "./Game";
import { useEffect, useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

const ProfileGames = (props) =>{

    const {games, userData, fetchedGamesStart} = props;
    // console.log(games)

    const [display, setDisplay] = useState('block');

    useEffect(() =>{
        setDisplay('block')
    }, [fetchedGamesStart])

    if (games.length === 0){
        return(
            <div className="profile-games-wrapper">
                    <div className="profile-game">
                        <div className="profile-no-games-found">
                            <p>No games found</p>
                        </div>
                        
                    </div>
            </div>
            
        )
        // console.log('no games')
    }
    else if (!games[0]) {
        return (
            <div className="profile-games-wrapper">
                    
                        <div className="profile-games-loading">
                            <Icon id="load" path={mdiLoading} size={2} spin/>
                        </div>
                        
                   
                </div>
        );
      }

    const handleLoad = (e) =>{
        props.fetchMoreGamesData();
        setDisplay('none')
        console.log(display)
        return(
            <Icon path={mdiLoading} size={2} spin/>
        )
    }
    
    return (
        <div className="profile-games-wrapper">
                
                {games.map((game) =>(
                    <div className={`profile-game`} key={game.info.gameId}>
                        {/* {console.log(game.info.gameId)} */}
                        <Game
                            userData={userData}
                            game={game}
                        />
                    </div>
                ))}

            {games[fetchedGamesStart - 1] ?(
            <div className="fetchMore">
                
                <button style={{display: display}} onClick={handleLoad}>Fetch more</button>
                {display === 'none' && <Icon path={mdiLoading} size={2} spin />}
            </div>
            ):(
                <div className="profile-games-wrapper">
                    <div className="profile-game">
                        <div className="profile-no-games-found">
                            <p>No more games found</p>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
        
    )
}

export default ProfileGames;