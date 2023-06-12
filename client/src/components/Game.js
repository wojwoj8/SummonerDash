import { useEffect, useState } from "react";

const Game = (props) => {

    const {game, userData} = props;
    // console.log(userData)
    // console.log(game)

    const [playerData, setPlayerData] = useState({});
    const [icon, setIcon] = useState({});
    const [gameDates, setGameDates] = useState({});
    const [queue, setQueue] = useState({});

    useEffect(() =>{
        getGameOfCheckedPlayer();
        calcDate();
        gameDuration();
        fetchQueueType();
        
        
    }, [])

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
        fetch(`/gameData/icons/${id}`).then(
            res => res.json()
        ).then(
            data =>{
                setIcon(data)
            }
            
        )
    }

    const fetchQueueType = async () =>{
        fetch(`/gameData/queueType/${game.info.queueId}`).then(
            res => res.json()
        ).then(
            data =>{
                setQueue(data)
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
        setGameDates((prev) => ({
            ...prev, whenPlayed
        }))
        // console.log(message);
    }

    const gameDuration = () =>{

        const gameCreation = game.info.gameCreation;
        const gameEnd = game.info.gameEndTimestamp;
        const timeDifferenceInMs = gameEnd - gameCreation;

        let seconds  = Math.floor((timeDifferenceInMs / (1000)) % 60);
        let minutes = Math.floor((timeDifferenceInMs / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifferenceInMs / (1000 * 60 * 60)) % 24);

        let gameDur = '';
        if (seconds < 10){
            seconds = `0` + seconds;
        }
        if (hours > 0){
            if (minutes < 10){
                minutes = `0` + minutes;
            }
            gameDur = `${hours}:${minutes}:${seconds}`;
        }
        else{
            gameDur = `${minutes}:${seconds}`;
        }
        setGameDates((prev) => ({
            ...prev, gameDur
        }))
    }

    //for backgroud color of div dependent of game result
    const divClassName = () =>{
        let gameResult = '';
        // parent div class name
        // let div = document.querySelector('.profile-game-data').parentElement;
        
        // console.log(playerData)

        if (playerData.win === false){
            gameResult = 'Defeat';


        } else if (playerData.win === true){
            gameResult = 'Victory';


        } else{
            gameResult = 'Remake';

        }
        // console.log(gameResult)
        
         return gameResult;
    }
    return(

        <div className={`profile-game-data ${divClassName()}`} >
            {/* <p>{playerData.win}</p> */}
            
            {/* <p>{game.info.gameId}</p> */}
            {/* <p>{playerData.championName}</p> */}
            
            <p>{queue.description}</p>
            <p>{gameDates.whenPlayed}</p>
            {/* game result */}
            <p>{divClassName()}</p>
            <p>{gameDates.gameDur}</p>
            <img src={icon.playerIcon} alt="icon"></img>
        </div>
    )
}

export default Game;