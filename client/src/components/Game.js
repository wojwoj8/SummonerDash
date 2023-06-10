import { useEffect, useState } from "react";

const Game = (props) => {

    const {game, userData} = props;
    // console.log(userData)
    // console.log(game)

    const [playerData, setPlayerData] = useState({});
    const [icon, setIcon] = useState({});
    const [gameDates, setGameDates] = useState({})

    useEffect(() =>{
        getGameOfCheckedPlayer();
        calcDate();
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
    // console.log(playerData)
    // console.log(typeof(game.info.gameCreation))
    // console.log(game)

    const calcDate = () => {
        
        const currDate = Date.now();
        const gameCreation = game.info.gameCreation;
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
            gameDate = "a few moments ago";
        }

        const whenPlayed = `${gameDate} ago`;
        setGameDates({whenPlayed})
        // console.log(message);
}


    
    
    return(

        <div>
            {/* <p>{game.info.gameId}</p> */}
            {/* <p>{playerData.championName}</p> */}
            <p>{gameDates.whenPlayed}</p>
            <img src={icon.icon} alt="icon"></img>
        </div>
    )
}

export default Game;