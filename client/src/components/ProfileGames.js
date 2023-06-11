import Game from "./Game";

const ProfileGames = (props) =>{

    const {games, userData} = props;
    console.log(games)

    if (games.length === 0){
        return(
            <div className="profile-games-wrapper">
                <div className="profile-games">
                    <div className="profile-game">
                        <p>No games found</p>
                    </div>
                </div>
            </div>
            
        )
        console.log('no games')
    }
    else if (!games[0]) {
        return <p>Loading games...</p>;
      }
    return (
        <div className="profile-games-wrapper">
            <div className="profile-games">
                {games.map((game) =>(
                    <div className="profile-game" key={game.info.gameId}>
                        <Game
                            userData={userData}
                            game={game}
                        />
                    </div>
                ))}
            
            </div>
        </div>
        
    )
}

export default ProfileGames;