import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
const ProfileRanks = (props) => {

    const {data, solo, flex, setButton, loading, 
        rateMess, cooldown, seconds} = props;

    
    // for miniseries under profile rank icon display
    const miniSeriesMap = (serieGames) => {
        const data = serieGames.split('');
        const elem = data.map((state, i) => (
          <div className={`profile-miniseries-game ${state.toLowerCase()}`} key={i}>
            <p>{state}</p>
          </div>
        ));
      
        return elem;
      };

    return(

        <div className="profile-playerData-wrapper">
            {(typeof data.name === 'undefined')?(
                <div id="loading">
                    <Icon path={mdiLoading} size={2} spin id="loading" />
                </div>
                
                
                ):(
                <div className="profile">
                    <div className="profile-top">
                        <div className="profile-top-imglv">
                            <img src={data.iconImg} alt="summoner"></img>
                            <p>{data.summonerLevel}</p>
                        </div>
                    
                            <div className="profile-top-data">
                                
                                <h2>{data.name}</h2>
                                <div id="reload-data">
                                    <button className="button" disabled={cooldown}  onClick={e => setButton(true)}>
                                        {loading ? 
                                        (<Icon id="load" path={mdiLoading} size={1} spin/>) : 
                                        rateMess === "Rate limit exceeded" ? (
                                            `Try in ${seconds}s`
                                        ):(
                                            'Update'
                                        )
                                        }
                                    </button>
                                    
                                </div>
                                
                            </div>
                            </div>
                                {(typeof solo === 'undefined' || typeof solo.tier === 'undefined')?(
                                    <div className="profile-solo">
                                        <h2> Ranked Solo</h2>
                                        <hr></hr>
                                        <p data-testid="solo-unrank">Unranked</p>
                                    </div>
                                ):(
                                <div className="profile-solo">
                                    <h2> Ranked Solo</h2>
                                    <hr></hr>
                                    <div className="profile-queue-data">
                                        <div className="img-miniseries-wrapper">
                                            <div className="profile-rank-img">
                                                <div className="tooltip-container">
                                                    <img src={solo.rankIcon} alt="rankIcon"></img>
                                                        <div className="tooltip">
                                                            <p>{solo.tier} {solo.rank}</p>
                                                            <p>LP: {solo.leaguePoints}</p>  
                                                        </div>
                                                </div>
                                            </div>
                                            {solo.miniSeries ? (
                                                <div className="profile-miniseries">
                                                   {miniSeriesMap(solo.miniSeries.progress)}

                                                </div>
                                            ) : (
                                                null
                                            )}
                                            
                                        </div>
                                        <div className="profile-rank-lp">
                                            <h2>{solo.tier} {solo.rank}</h2>
                                            <p>LP: {solo.leaguePoints}</p>  
                                        </div>

                                        <div className="profile-winratio">
                                            <p>W: {solo.wins} L: {solo.losses}</p>
                                            <p>Winrate: {solo.winrate}%</p>
                                        </div>      
                                    </div> 
                                    
                                </div>
                                )}
                                {(typeof flex === 'undefined' || typeof flex.tier === 'undefined')?(
                                    <div className="profile-flex">
                                        <h2> Ranked Flex</h2>
                                        <hr></hr>
                                        <p data-testid="flex-unrank">Unranked</p>
                                    </div>
                                ):(
                                <div className="profile-flex">
                                    <h2> Ranked Flex</h2>
                                    <hr></hr>
                                    <div className="profile-queue-data">
                                        <div className="img-miniseries-wrapper">
                                            <div className="profile-rank-img">
                                                <div className="tooltip-container">
                                                    <img src={flex.rankIcon} alt="rankIcon"></img>
                                                        <div className="tooltip">
                                                            <p>{flex.tier} {flex.rank}</p>
                                                            <p>LP: {flex.leaguePoints}</p>  
                                                        </div>
                                                </div>
                                                
                                            </div>
                                            {flex.miniSeries ? (
                                                <div className="profile-miniseries">
                                                   {miniSeriesMap(flex.miniSeries.progress)}

                                                </div>
                                            ) : (
                                                null
                                            )}
                                        </div>
                                        <div className="profile-rank-lp">
                                            <h2>{flex.tier} {flex.rank}</h2>
                                            <p>LP: {flex.leaguePoints}</p>  
                                        </div>

                                        <div className="profile-winratio">
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

export default ProfileRanks;