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
    const [button, setButton] = useState(false)
    // gamesData
    const [games, setGames] = useState({});

    // loading for fetch games button
    const [display, setDisplay] = useState('block');

    //loading for reload games button
    const [loading, setLoading] = useState(false);

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
                    // console.log(data)
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
                console.log('users fetched')
                fetchGamesData();
                
            }
          ).catch((error) => {
            console.log('Error fetching user data:', error)
        }
        );
    }

    const fetchGamesData = async () =>{
        fetch(`/gamesData/${query.region}/${query.name}/0`).then(
            res => res.json()
        ).then(
            data=>{
                // console.log('first games data')
                // console.log(data)
                setGames(data);
                setFetchedGamesStart(5)
                console.log(fetchedGamesStart)
                console.log('fetched games')
                setButton(false)
                setLoading(false)
                
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
                console.log(games)
                console.log('fetching more data')
            }
        
        ).catch((error) => {
            console.log('Error fetching games data:', error)
        }
        );
    }

    const reloadData = async () => {
        setFetchedGamesStart(0);
        await new Promise(resolve => {
          fetchUserData();
          resolve();
        });
        
      };
    useEffect(() =>{
        if (button){
            setLoading(true)
            setDisplay('none')
            reloadData();
            
            
        }
    }, [button])
    
    if (err.err){
        console.log(err.err)
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
                setButton={setButton}
                loading={loading}
                

            />
            

            <ProfileGames
                userData={data}
                games={games}
                display={display}
                setDisplay={setDisplay}
                button={button}
                setButton={setButton}
                fetchMoreGamesData={fetchMoreGamesData}
                fetchedGamesStart={fetchedGamesStart}

            />
            
            
        </div>
    )
}
export default Profile;