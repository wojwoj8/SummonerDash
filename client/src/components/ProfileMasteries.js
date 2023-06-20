const ProfileMasteries = (props) =>{

    const {masteries} = props
    console.log(masteries)
    console.log(typeof(masteries))
    console.log(masteries.length)

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
                console.log(masteries)
                // somehow make if array is empty display none
                // <p>loading....</p>
            ): (
                
                <div className="profile-masteries">
                    {console.log(masteries.length)}
                    <div>
                        <h2> Most Played </h2>
                    </div>
                {masteries.map((masterie, i) => (
                    <div key={i}>
                        <p>
                            {masterie.name}
                        </p>
                        <div className="masterie-img-container">
                            <img src={masterie.squarePortraitPath} alt="masterieImg"></img>
                            <div className="masterie-img-data">
                                <p>Masterie Level: {masterie.championLevel}</p>
                                <p>Total Points: {masterie.championPoints}</p>
                                <p>Last Played: {calculateLastGame(masterie.lastPlayTime)}</p>
                           </div>
                            
                        </div>
                    </div>
                    
                ))}
                </div>
            )}
            
        </div>
                
    )
}
export default ProfileMasteries;