import { useEffect, useState } from "react";

const Game = (props) => {

    const {game, userData} = props;
    // console.log(userData)
    // console.log(game)
    const {allPlayerImgIds, info, metadata, queueData} = game;
    const [playerData, setPlayerData] = useState({});
    const [icon, setIcon] = useState({});
    const [calculations, setCalculations] = useState({});

    //for fetching
    useEffect(() =>{
        getGameOfCheckedPlayer();
        // fetchQueueType();   
    }, [])


    //done after playerData fetched
    useEffect(() =>{
        calcDate();
        gameDuration();
        
    },[playerData])

    useEffect(()=>{
        calcCsPerMin(calculations.minutes);
    },[calculations.minutes])

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
        setCalculations((prev) => ({
            ...prev, whenPlayed
        }))
        calcCsPerMin();
        // console.log(message);
    }

    const gameDuration = () =>{

        
        const timeDifferenceInSeconds = playerData.timePlayed;

        let seconds = timeDifferenceInSeconds % 60;
        let minutes = Math.floor((timeDifferenceInSeconds / 60) % 60);
        const hours = Math.floor((timeDifferenceInSeconds / (60 * 60)) % 24);

        let gameDur = '';
        if (seconds < 10){
            seconds = `0` + seconds;
        }
        if (hours > 0){
            if (minutes < 10){
                minutes = `0` + minutes;
            }
            gameDur = `${hours}h ${minutes}m ${seconds}s`;
        }
        else{
            gameDur = `${minutes}m ${seconds}s`;
        }
        setCalculations((prev) => ({
            ...prev, gameDur, minutes: minutes
        }))

        
    }

    const calcKda = () =>{
        if (playerData.deaths === 0){

            return (
               <p id='game-perfect'>Perfect KDA</p> 
               )
        }
        const kda = ((playerData.assists + playerData.kills)/playerData.deaths).toFixed(2);
        if (kda >= 3){
            // color = gold;
            return (
                <p id="game-good">{kda}:1 KDA</p>
            )
        }
        else{
            return (
                <p id="game-notgood">{kda}:1 KDA</p>
            )
        }
       
        
    }

    //for backgroud color of div dependent of game result
    const divClassName = () =>{
        let gameResult = '';

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

    const calcCsPerMin = (time) =>{
        const allCs = playerData.totalMinionsKilled + playerData.neutralMinionsKilled;
        // let time = calculations.minutes;

        // i think it is still imposible
        if (time < 1){
            time = 1
        }

        const csPerMin = (allCs/time).toFixed(1);
        // console.log(csPerMin)
        setCalculations(prev => ({
            ...prev, csPerMin
        }))
        
    }
    
    return(

        <div className={`profile-game-data ${divClassName()}`} >

            <div className="game-data-queue-when">
                <p>{queueData.description}</p>
                <p>{calculations.whenPlayed}</p>
            </div>

            <div className="game-data-time-status">
                <p>{divClassName()}</p>
                <p>{calculations.gameDur}</p>
            </div>

            <div className="game-data-icon-kda">
                
                <div id='inGame-level'>   
                    <div className="some-wrapper">
                        <div id="img-wrapper">
                            <img src={icon.playerIcon} alt="icon"></img>
                        </div>
                    
                        <div id="inGamelevel-position">   
                            <p>{playerData.champLevel}</p>
                        </div>
                    </div> 
                </div>
                
                <div className="stats-kda">
                    <p id="stats-kill-death-assist"><span id="game-kills">{playerData.kills}</span>/<span id='game-deaths'>{playerData.deaths}</span>/<span id="game-assists">{playerData.assists}</span></p>
                    {calcKda()}
                </div>
                
                    
            </div>
            
            <p>CS {playerData.totalMinionsKilled + playerData.neutralMinionsKilled}({calculations.csPerMin})</p>
            
            {/* game result */}
            
            

            
        </div>
    )
}

export default Game;