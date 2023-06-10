import Game from "./Game";

const ProfileGames = (props) =>{

    const {games, userData} = props;
    console.log(games)

    if (!games[0]) {
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