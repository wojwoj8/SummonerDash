import Game from "./Game";
import { useState } from "react";

const ProfileGames = (props) =>{

    const {games, userData} = props;
    // console.log(games)


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
        return <p>Loading games...</p>;
      }
    return (
        <div className="profile-games-wrapper">
           
                {games.map((game) =>(
                    <div className={`profile-game`} key={game.info.gameId}>
                        <Game
                            userData={userData}
                            game={game}
                        />
                    </div>
                ))}
            
           
        </div>
        
    )
}

export default ProfileGames;