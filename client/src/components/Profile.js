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
                
                setData(data[0])
                console.log(data[0])
                console.log(data[1])
            }
          )
    }

    const { id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel } = data;
    return(
        <div>
            {(typeof data.name === 'undefined')?(
                <p>loading...</p>
                ):(
                <div>
                    <p>ID: {id}</p>
                    <p>Account ID: {accountId}</p>
                    <p>Puuid: {puuid}</p>
                    <p>Name: {name}</p>
                    <p>Profile Icon ID: {profileIconId}</p>
                    <p>Revision Date: {revisionDate}</p>
                    <p>Summoner Level: {summonerLevel}</p>
                </div>
                )
            }
        </div>
    )
}
export default Profile;