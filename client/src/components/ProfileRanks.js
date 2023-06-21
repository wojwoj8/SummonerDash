import { useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
const ProfileRanks = (props) => {

    const {data, solo, flex, err, setButton, loading} = props;

    
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
            {/* {console.log(flex)} */}
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
                                
                                <h2>{data.name}</h2>
                                <div id="reload-data">
                                    <button className="button"  onClick={e => setButton(true)}>
                                        {loading ? 
                                        (<Icon id="load" path={mdiLoading} size={1} spin/>) : 
                                        'Update'}
                                    </button>
                                    
                                </div>
                                
                            </div>
                            </div>
                                {(typeof solo === 'undefined' || typeof solo.tier === 'undefined')?(
                                    <div className="profile-solo">
                                        <h2> Ranked Solo</h2>
                                        <p data-testid="solo-unrank">Unranked</p>
                                    </div>
                                ):(
                                <div className="profile-solo">
                                    <h2> Ranked Solo</h2>
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
                                                    {/* <p>{solo.miniSeries.progress[0]}</p> */}
                                                   {miniSeriesMap(solo.miniSeries.progress)}

                                                </div>
                                            ) : (
                                                null
                                            )}
                                            
                                        </div>
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
                                        <p data-testid="flex-unrank">Unranked</p>
                                    </div>
                                ):(
                                <div className="profile-flex">
                                    <h2> Ranked Flex</h2>
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
                                                    {/* <p>{solo.miniSeries.progress[0]}</p> */}
                                                   {miniSeriesMap(flex.miniSeries.progress)}

                                                </div>
                                            ) : (
                                                null
                                            )}
                                        </div>
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

export default ProfileRanks;