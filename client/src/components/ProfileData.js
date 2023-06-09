const ProfileData = (props) => {

    const {data, solo, flex, err} = props;


    return(

        <div className="profile-data">
            {(typeof data.name === 'undefined')?(
                <p>loading...</p>
                
                ):(
                <div className="profile">
                    <div className="profile-top">
                        <div className="profile-top-imglv">
                            <img src={data.iconImg} alt="summoner"></img>
                            <p>{data.summonerLevel}</p>
                        </div>
                    
                            <div className="profile-top-data">
                                
                                <p>{data.name}</p>
                                
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
                                    <div className="profile-queue-data">
                                        <img src={solo.rankIcon} alt="rankIcon"></img>
                                        <div>
                                            <p>{solo.tier} {solo.rank}</p>
                                            <p>LP: {solo.leaguePoints}</p>  
                                        </div>

                                        <div>
                                            <p>W: {solo.wins} L: {solo.losses}</p>
                                            <p>Winrate: {solo.winrate}%</p>
                                        </div>      
                                    </div> 
                                    
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
                                    <div className="profile-queue-data">
                                        <img src={flex.rankIcon} alt="rankIcon"></img>
                                        <div>
                                            <p>{flex.tier} {flex.rank}</p>
                                            <p>LP: {flex.leaguePoints}</p>  
                                        </div>

                                        <div>
                                            <p>W: {flex.wins} L: {flex.losses}</p>
                                            <p>Winrate: {flex.winrate}%</p>
                                        </div>      
                                    </div>                          
                                </div>
                                )}
                            
                </div>
                )
            }
        </div>
    )
}

export default ProfileData;