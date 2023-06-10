import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ProfileData from "./ProfileData";
import ProfileGames from "./ProfileGames";

const Profile = () =>{

    // userData
    const [err, setErr] = useState({})
    const [data, setData] = useState({});
    const [solo, setSolo] = useState({});
    const [flex, setFlex] = useState({});

    // gamesData
    const [games, setGames] = useState({});

    const query = useParams();
    // console.log(query)

    useEffect(() =>{
        fetchUserData();
        fetchGamesData();
    }, [])

    const fetchUserData = async () =>{
        // console.log(query)
        fetch(`/userData/${query.name}`).then(
            res => res.json()
          ).then(
            data =>{
                if (data.err){
                    console.log(data)
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
                //  console.log(data[0])
                
            }
          )
    }

    const fetchGamesData = async () =>{
        fetch(`/gamesData/${query.name}`).then(
            res => res.json()
        ).then(
            data=>{
                // console.log(data)
                setGames(data);
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

    return(
        <div className="profile-wrapper">
            
            <ProfileData
                data={data}
                solo={solo}
                flex={flex}
                err={err}
            />

            <ProfileGames
                userData={data}
                games={games}

            />
            
        </div>
    )
}
export default Profile;