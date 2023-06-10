const ProfileGames = (props) =>{

    const {games} = props;
    console.log(games)

    if (!games[0]) {
        return <p>Loading games...</p>;
      }
    return (
        <div className="profile-games-wrapper">
            <div className="profile-games">
                {games.map((game) =>(
                    <div className="profile-game" key={game.info.gameId}>
                        <p>{game.info.gameId}</p>
                        
                    </div>
                ))}
            
            </div>
        </div>
        
    )
}

export default ProfileGames;