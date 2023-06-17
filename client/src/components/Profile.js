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
    const [fetchedGamesStart, setFetchedGamesStart] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [reachedBottom, setReachedBottom] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);
    // gamesData
    const [games, setGames] = useState({});

    const query = useParams();
    // console.log(query)

    useEffect(() =>{
        fetchUserData();
        
    }, [])


    const fetchUserData = async () =>{
        // console.log(query)
        fetch(`/userData/${query.region}/${query.name}`).then(
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
                fetchGamesData();
                
            }
          ).catch((error) => {
            console.log('Error fetching user data:', error)
        }
        );
    }

    const fetchGamesData = async () =>{
        fetch(`/gamesData/${query.region}/${query.name}/${fetchedGamesStart}`).then(
            res => res.json()
        ).then(
            data=>{
                // console.log('first games data')
                // console.log(data)
                setGames(data);
                setFetchedGamesStart(prev => fetchedGamesStart + 5)
            }
        ).catch((error) => {
            console.log('Error fetching games data:', error)
        }
        );
    }

    const fetchMoreGamesData = async () =>{
        fetch(`/gamesData/${query.region}/${query.name}/${fetchedGamesStart}`).then(
            res => res.json()
        ).then(
            data=>{            
                setGames([...games, ...data]);
                setFetchedGamesStart(prev => fetchedGamesStart + 5)
            }
        ).catch((error) => {
            console.log('Error fetching games data:', error)
        }
        );
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
                fetchMoreGamesData={fetchMoreGamesData}

            />
            
            
        </div>
    )
}
export default Profile;