const ProfileMasteries = (props) =>{

    const {masteries} = props
    console.log(masteries)
    // console.log(typeof(masteries))
    // console.log(masteries.length)

    const calculateLastGame = (dataMs) =>{

        const currDate = Date.now();
        const gameCreation = dataMs
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

        return gameDate + ' ago'

    }
    return(
        
        
        <div className="profile-masteries-wrapper">
            {(typeof masteries[0] === 'undefined') ? (
                <div>
                   
                    {Array.isArray(masteries) ? <p>No data</p> : <p>loading...</p> }
                </div>
                
                
                // somehow make if array is empty display none
                // <p>loading....</p>
            ): (
                
                <div className="profile-masteries">
                    {/* {console.log(masteries.length)} */}
                    
                    <div className="masterie-img-wrapper">
                    <div className="profile-masteries-title 0">
                        <h2> Most Played </h2>
                    </div>
                    {masteries.map((masterie, i) => (
                    <div className={`masterie-img-container ${i}`} key={i}>
                        <div className="masterie-img">
                            <img src={masterie.squarePortraitPath} alt="masterieImg"></img>
                            <div className="masterie-img-data">
                                <p>{masterie.name}</p>
                                <p>Masterie Level: {masterie.championLevel}</p>
                                                {/* display , every 3 digits */}
                                <p>Total Points: {masterie.championPoints.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                                <p>Last Played: {calculateLastGame(masterie.lastPlayTime)}</p>
                           </div>
                            
                        </div>
                    </div>
                    
                ))}
                    </div>
                
                </div>
            )}
            
        </div>
                
    )
}
export default ProfileMasteries;