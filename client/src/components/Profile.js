import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ProfileData from "./ProfileData";
import ProfileGames from "./ProfileGames";
import ErrorPage from "./ErrorPage";

const Profile = () =>{

    // userData
    const [err, setErr] = useState({})
    const [data, setData] = useState({});
    const [solo, setSolo] = useState({});
    const [flex, setFlex] = useState({});
    const [masteries, setMasteries] = useState({});
    const [fetchedGamesStart, setFetchedGamesStart] = useState(0);
    const [button, setButton] = useState(false)
    const [rateMess, setRateMess] = useState("");
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
                // console.log(data)
                if (data[0]?.status){
                    // console.log(data[0])
                    setErr(data[0]);
                    return
                }
                document.title = `${query.name} - SummonerDash`;
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
                setMasteries(data[2])
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
                console.log(data)
                if (data[0]?.status){
                    console.log(data[0])
                    setErr(data[0]);
                    return
                }
                if (data.status){
                    setFetchedGamesStart(10)
                    setRateMess(data.status.message);
                    return
                }
                if(data[data.length -1]?.status){
                    setRateMess(data[data.length -1].status.message);
                    setFetchedGamesStart(prev => fetchedGamesStart + 10)
                    data.pop()
                    return
                }
                // console.log('first games data')
                // console.log(data)
                setGames(data);
                setFetchedGamesStart(10)
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
                console.log(data)
                if (data[0]?.status){
                    console.log(data[0])
                    setErr(data[0]);
                    return
                }
                // rate error in for example 15 of 20 games
                if(data[data.length -1]?.status){
                    setRateMess(data[data.length -1].status.message);
                    setFetchedGamesStart(prev => fetchedGamesStart + 10)
                    data.pop()
                    return
                }
                // console.log(data)            
                setGames([...games, ...data]);
                setFetchedGamesStart(prev => fetchedGamesStart + 10)
                // console.log(games)
                // console.log('fetching more data')
            }
        
        ).catch((error) => {
            console.log('Error fetching games data:', error)
            const catchError = [
                {
                    "status": {
                        "message": "Something went wrong",
                        "status_code": 2137,
                    }
                }
            ]
            setErr(catchError)
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
    
    if (err.status){
        document.title = "SummonerDash";
        console.log(err.status.message)
        return(
            <div className="error">
                <ErrorPage
                    err={err}
                />

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
                masteries={masteries}
                

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
                rateMess={rateMess}

            />
            
            
        </div>
    )
}
export default Profile;