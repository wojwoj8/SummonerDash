import { useEffect, useState } from "react";

const Game = (props) => {

    const {game, userData} = props;
    // console.log(userData)
    // console.log(game)

    const [playerData, setPlayerData] = useState({});
    const [icon, setIcon] = useState({});

    useEffect(() =>{
        getGameOfCheckedPlayer();
        
    },[])
    const getGameOfCheckedPlayer = () =>
    {
        for(let i = 0; i < 10; i++){
            // console.log(game.info.participants[i].championName)
            if (game.info.participants[i].summonerId === userData.id){
                setPlayerData(game.info.participants[i])
                fetchIcon(game.info.participants[i].championId);
                // console.log(game.info.participants[i].championName)
            }
        }
    }
    const fetchIcon = async (id) =>{
        // console.log(typeof(championId))
        fetch(`/gameData/${id}`).then(
            res => res.json()
        ).then(
            data =>{
                setIcon(data)
            }
            
        )
    }
    // getGameOfCheckedPlayer();
    return(

        <div>
            <p>{game.info.gameId}</p>
            <p>{playerData.championName}</p>
            <img src={icon.icon} alt="icon"></img>
        </div>
    )
}

export default Game;