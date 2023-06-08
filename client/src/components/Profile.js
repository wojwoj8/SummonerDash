import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const Profile = () =>{


    const [err, setErr] = useState({})
    const [data, setData] = useState({});
    const [solo, setSolo] = useState({});
    const [flex, setFlex] = useState({});

    const query = useParams();
    // console.log(query)

    useEffect(() =>{
        fetchData();
    }, [])

    const fetchData = async () =>{
        // console.log(query)
        fetch(`/data/${query.name}`).then(
            res => res.json()
          ).then(
            data =>{
                if (data.err){
                    console.log('error')
                    setErr(data);
                    return
                }
                setData(data[0])
                // console.log(data[1][0]["queueType"])
                if (data[1][0]){

                
                    if (data[1][0]["queueType"] === "RANKED_SOLO_5x5"){
                        setSolo(data[1][0]);
                        setFlex(data[1][1]);
                    }
                    else if (data[1][0]["queueType"] === "RANKED_FLEX_SR"){
                        setFlex(data[1][0]);
                        setSolo(data[1][1]);
                    }
                }
                // console.log(data)
                
            }
          )
    }
    if (err.err){
        console.log('error')
        return(
            <div className="error">
                <p>{err.err}</p>
            </div>
        )
    }
    const { id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel, iconImg} = data;
    const {leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins, 
        losses, veteran, inactive, freshBlood, hotStreak, winrate } = solo

    // const {leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins, 
    //     losses, veteran, inactive, freshBlood, hotStreak, winrate } = flex
    // console.log(data[0])
    return(
        <div>
            
            {(typeof data.name === 'undefined')?(
                <p>loading...</p>
                
                ):(
                <div className="profile">
                    <div className="profile-top">
                    <img src={iconImg} alt="summoner"></img>
                            <div className="profile-top-data">
                                
                                <p>Name: {name}</p>
                                <p>Summoner Level: {summonerLevel}</p>
                            </div>
                            </div>
                                {(typeof tier === 'undefined')?(
                                    <div className="profile-solo">
                                        <h2> Ranked Solo</h2>
                                        <p>unranked</p>
                                    </div>
                                ):(
                                <div className="profile-solo">
                                    <h2> Ranked Solo</h2>
                                    <p>Wins: {wins}</p>
                                    <p>Losses: {losses}</p>
                                    <p>Winrate: {winrate}%</p>
                                    <p>Rank: {queueType} {tier} {rank}</p>   
                                    <p>LP: {leaguePoints}</p> 
                                </div>
                                )}
                                {(typeof flex === 'undefined' || typeof flex.tier === 'undefined')?(
                                    <div className="profile-flex">
                                        <h2> Ranked Flex</h2>
                                        <p>unranked</p>
                                    </div>
                                ):(
                                <div className="profile-flex">
                                    <h2> Ranked Flex</h2>
                                    <p>Wins: {flex.wins}</p>
                                    <p>Losses: {flex.losses}</p>
                                    <p>Winrate: {flex.winrate}%</p>
                                    <p>Rank: {flex.queueType} {flex.tier} {flex.rank}</p>
                                    <p>LP: {flex.leaguePoints}</p>     
                                </div>
                                )}
                               
                                
                            
                    
                    
                    {/* <p>ID: {id}</p>
                    <p>Account ID: {accountId}</p>
                    <p>Puuid: {puuid}</p>
                    
                    <p>Profile Icon ID: {profileIconId}</p>
                    <p>Revision Date: {revisionDate}</p> */}
                    
                    
                </div>
                )
            }
        </div>
    )
}
export default Profile;