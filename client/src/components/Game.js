import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Game = (props) => {

    const { data } = useParams();

    const {game, userData} = props;
    // console.log(userData)
    // console.log(game)
    const {allPlayerImgIds, info, metadata, queueData} = game;
    
    const [playerData, setPlayerData] = useState({});
    const [playerImgs, setPlayerImgs] = useState({});
    const [calculations, setCalculations] = useState({});

    const {imgIds, playerIdName, runes} = playerImgs;




    //for fetching
    useEffect(() =>{
        getGameOfCheckedPlayer();
        // fetchQueueType();   
    }, [])

    // useEffect(() => {
    //     console.log(playerData);
    //   }, [playerData]);

    //done after playerData fetched
    useEffect(() =>{
        //somehow when I add more to playerData it loads much longer
        calcDate();
        gameDuration();
 
    },[playerData])

    useEffect(()=>{
        calcCsPerMin(calculations.minutes);
    },[calculations.minutes])

    const getGameOfCheckedPlayer = () =>
    {
        for(let i = 0; i < game.info.participants.length; i++){
            // console.log(game.info.participants[i].championName)
            if (game.info.participants[i].summonerId === userData.id){
                // console.log(game.allPlayerImgIds[i])
                
                // setPlayerData({
                //     ...playerData,
                //     player: game.info.participants[i],
                //     playerImgIds: allPlayerImgIds[i]
                //   })
                // console.log(playerData.player)   
                setPlayerData(game.info.participants[i])
                setPlayerImgs(allPlayerImgIds[i])
                return
                // calcDate();
                // gameDuration();
                // return
                // fetchIcon(game.info.participants[i].championId);
                
            }
        }
        
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
            gameDate = "a few moments";
        }

        const whenPlayed = `${gameDate} ago`;
        setCalculations((prev) => ({
            ...prev, whenPlayed
        }))
        calcCsPerMin();
        // console.log(message);
    }

    const gameDuration = () =>{

        // console.log(player.timePlayed)
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

        } 
        if (playerData.timePlayed < 240){
            // console.log(playerData.timePlayed)
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

    const playersData = () => {
        const region = game.info.platformId.toLowerCase();
        
        // target _blank make link open in other card
        const playerElements = allPlayerImgIds.map((player, i) => (
          <div className="icon-name-container" key={i}>
            <img src={player.imgIds.championId.iconPath} alt="champIcon" />
                <Link to={`/${region}/name/${player.playerIdName.summonerName}`}target="_blank"><p>{player.playerIdName.summonerName}</p></Link>
          </div>
        ));
        // filter who is in left or right column
        return (
          
            <div className="game-players">
                
                <div className="left-col">
                    {playerElements.filter((_, i) => i < allPlayerImgIds.length / 2)}
                </div>
                <div className="right-col">
                    {playerElements.filter((_, i) => i >= allPlayerImgIds.length / 2)}
                </div>
            </div>
          
        );
      };
    
    const largestMultiKill = () =>{
        const multikill = playerData.largestMultiKill;
        if (multikill >= 2){
            if(playerData.pentaKills){
                return(
                    <p>Penta kill</p>
                )
            }
            if(playerData.quadraKills){
                return(
                    <p>Quadra kill</p>
                )
            }
            if(playerData.tripleKills){
                return(
                    <p>Triple kill</p>
                )
            }
            if(playerData.doubleKills){
                return(
                    <p>Double kill</p>
                )
            }
            
        }
    }

    // description from my api has <> chars and it cuts it
    const itemDescCut = (string) => {
        // Remove HTML tags except for <br>
        const strippedString = string.replace(/<(?!br\s*\/?)[^>]+>/gi, '');
    
        // Split the string at "<br>" and wrap each part with a <span> element
        const formattedString = strippedString.split("<br>").map((part, index) => (
          <span key={index}>
            {part}
            {index !== strippedString.length - 1 && <br />} {/* Add <br> element after each part except the last one */}
          </span>
        ));
    
        return formattedString;
      };

    const displayItems = () => {
        const items = Object.fromEntries(
          Object.entries(imgIds).filter(([key]) => key.includes('item'))
        );
        
        
        const boughtItemsElement = Object.entries(items).map(([key, item], i) => (
          item.name ?(
            <div className="tooltip-container" key={i}>
                <img src={item.iconPath} alt={`Item${i}`} />
                <div className="tooltip">
                    <h2>{item.name}</h2>
                    <div className="tooltip-itemDesc">
                        {itemDescCut(item.description)}
                    </div>
                    
                    {item.priceTotal === 0 ? null : <p>Price: {item.priceTotal}</p>}
                    {key === 'item6' && item.categories && item.categories[item.categories.length - 1] === 'Vision' ? 
                    <div className="item6-visionData">
                        <p>Vision Score: {playerData.visionScore}</p> 
                        <p>Placed wards: {playerData.wardsPlaced}</p>
                        <p>Destroyed wards: {playerData.wardsKilled}</p>
                        <p>Control wards: {playerData.visionWardsBoughtInGame}</p>
                        
                        
                    </div>

                    : null}
                </div>
            </div>
          ):(
            <div className="tooltip-container" key={i}>
                <img src={item.iconPath} alt={`Item${i}`} />
            </div>
          )
          
        ));
      
        return boughtItemsElement;
      };

      const runesDescription= () =>{

      }
    return(

        <div className={`profile-game-data ${divClassName()}`}>
            {Object.keys(playerData).length === 0 ? (
                <div>Loading...</div>
                ) : (
                <>
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
                                    <img src={imgIds.championId.iconPath} alt="icon"></img>
                                </div>
                            
                                <div id="inGamelevel-position">   
                                    <p>{playerData.champLevel}</p>
                                </div>
                            </div> 
                        </div>
                        <div className="summonerSpells-wrapper">

                            <div className="tooltip-container">
                                <img src={imgIds.summoner1Id.iconPath} alt="summonerSpell"></img>
                                <div className="tooltip">
                                    <h2>{imgIds.summoner1Id.name}</h2>
                                    {imgIds.summoner1Id.description}
                                    <p>Uses: {playerData.summoner1Casts}</p>
                                </div>
                            </div>
                            
                            <div className="tooltip-container">
                                <img src={imgIds.summoner2Id.iconPath} alt="summonerSpell"></img>
                                <div className="tooltip">
                                    <h2>{imgIds.summoner2Id.name}</h2>
                                    <p>{imgIds.summoner2Id.description}</p>
                                    <p>Uses: {playerData.summoner2Casts}</p>
                                </div>
                            </div>

                        </div>


                        <div className="runes-wrapper">

                            <div className="tooltip-container">
                                <img src={runes.perks.styles[0].selections[0].perk.iconPath} alt="runesPrimary"></img>
                                
                                <div className="tooltip">
                                    <h2>{runes.perks.styles[0].selections[0].perk.name}</h2>
                                    {itemDescCut(runes.perks.styles[0].selections[0].perk.longDesc)}
                                   
                                </div>
                            </div>
                            
                            <div className="tooltip-container">
                                <img src={runes.perks.styles[1].style.iconPath} alt="runesSecondary"></img>
                           
                            </div>

                        </div>

                        <div className="stats-kda">
                            <p id="stats-kill-death-assist"><span id="game-kills">{playerData.kills}</span>/<span id='game-deaths'>{playerData.deaths}</span>/<span id="game-assists">{playerData.assists}</span></p>
                            {calcKda()}
                        </div>
                    </div>
                    
                    <div className="game-cs-data">
                        <p>CS {playerData.totalMinionsKilled + playerData.neutralMinionsKilled}({calculations.csPerMin})</p>
                        {playerData.challenges?.abilityUses && 
                        <div className="tooltip-container">
                            <p>
                                Ability uses: {playerData.challenges.abilityUses}
                            </p>    
                            <div className="tooltip">
                                <p>Q uses: {playerData.spell1Casts}</p>
                                <p>W uses: {playerData.spell2Casts}</p>
                                <p>E uses: {playerData.spell3Casts}</p>
                                <p>R uses: {playerData.spell4Casts}</p>
                            </div>
                            
                        </div>
                        
                        }
                        
                    </div>

                    <div className="game-special-data">
                        <div className="multikill">
                            {largestMultiKill()}
                        </div>
                    </div>

                    <div className="player-boughtItems">
                        {displayItems()}
                    </div>
                    

                    {/* players icons and nicks as links */}
                    <div className="game-players-wrapper">
                        {playersData()}        
                    </div>
                </>
            )}
        </div>
    )
}

export default Game;