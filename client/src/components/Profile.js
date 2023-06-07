import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const Profile = () =>{
    
    const [data, setData] = useState({});

    const query = useParams();
    // console.log(query)

    useEffect(() =>{
        fetchData();
    }, [])

    const fetchData = async () =>{
        fetch(`/name/${query.name}`).then(
            res => res.json()
          ).then(
            data =>{
                
                setData(data)
                console.log(data)
                
            }
          )
    }

    const { id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel, 
        leagueId, queueType, tier, rank, summonerId, summonerName, leaguePoints, wins, 
        losses, veteran, inactive, freshBlood, hotStreak, iconImg, winrate } = data;
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
                                <p>Wins: {wins}</p>
                                <p>Losses: {losses}</p>
                                <p>Winrate: {winrate}%</p>
                                <p>Rank: {queueType} {tier} {rank}</p>
                            
                            </div>
                    </div>
                    
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