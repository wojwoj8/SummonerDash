const ProfileData = (props) => {

    const {data, solo, flex, err} = props;


    return(

        <div className="profile-data">
            {(typeof data.name === 'undefined')?(
                <p>loading...</p>
                
                ):(
                <div className="profile">
                    <div className="profile-top">
                    <img src={data.iconImg} alt="summoner"></img>
                            <div className="profile-top-data">
                                
                                <p>Name: {data.name}</p>
                                <p>Summoner Level: {data.summonerLevel}</p>
                            </div>
                            </div>
                                {(typeof solo.tier === 'undefined')?(
                                    <div className="profile-solo">
                                        <h2> Ranked Solo</h2>
                                        <p data-testid="solo-unrank">unranked</p>
                                    </div>
                                ):(
                                <div className="profile-solo">
                                    <h2> Ranked Solo</h2>
                                    <p>Wins: {solo.wins}</p>
                                    <p>Losses: {solo.losses}</p>
                                    <p>Winrate: {solo.winrate}%</p>
                                    <p>Rank: {solo.tier} {solo.rank}</p>   
                                    <p>LP: {solo.leaguePoints}</p> 
                                </div>
                                )}
                                {(typeof flex === 'undefined' || typeof flex.tier === 'undefined')?(
                                    <div className="profile-flex">
                                        <h2> Ranked Flex</h2>
                                        <p data-testid="flex-unrank">unranked</p>
                                    </div>
                                ):(
                                <div className="profile-flex">
                                    <h2> Ranked Flex</h2>
                                    <p>Wins: {flex.wins}</p>
                                    <p>Losses: {flex.losses}</p>
                                    <p>Winrate: {flex.winrate}%</p>
                                    <p>Rank: {flex.tier} {flex.rank}</p>
                                    <p>LP: {flex.leaguePoints}</p>     
                                </div>
                                )}
                            
                </div>
                )
            }
        </div>
    )
}

export default ProfileData;