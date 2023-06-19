import { useState } from "react";
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
const ProfileData = (props) => {

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

        <div className="profile-data">
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
                                
                            </div>
                            </div>
                                {(typeof solo === 'undefined' || typeof solo.tier === 'undefined')?(
                                    <div className="profile-solo">
                                        <h2> Ranked Solo</h2>
                                        <p data-testid="solo-unrank">unranked</p>
                                    </div>
                                ):(
                                <div className="profile-solo">
                                    <h2> Ranked Solo</h2>
                                    <div className="profile-queue-data">
                                        <div>
                                            <img src={solo.rankIcon} alt="rankIcon"></img>
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
                                        <p data-testid="flex-unrank">unranked</p>
                                    </div>
                                ):(
                                <div className="profile-flex">
                                    <h2> Ranked Flex</h2>
                                    <div className="profile-queue-data">
                                        <div>
                                            <img src={flex.rankIcon} alt="rankIcon"></img>
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

                    <div id="reload-data">
                        <button  onClick={e => setButton(true)}>
                            {loading ? 
                            (<Icon id="load" path={mdiLoading} size={2} spin/>) : 
                            'Reload'}
                        </button>
                        
                    </div>
                            
                </div>
                )
            }
        </div>
    )
}

export default ProfileData;