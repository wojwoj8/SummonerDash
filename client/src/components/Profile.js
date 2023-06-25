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

    // for update and load more data (profile games and profile data)
    const [seconds, setSeconds] = useState(0);
    const [cooldown, setCoolDown] = useState(false);
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
                console.log(data.length)
                console.log(data)
                if (data[0]?.status){
                    console.log(data[0])
                    setErr(data[0]);
                    return
                }
                if (data.status){
                    setFetchedGamesStart(0)
                    setRateMess(data.status.message);
                    setButton(false)
                    setLoading(false)
                    return
                    
                }
                if(data[data.length -1]?.status){
                    setRateMess(data[data.length -1].status.message);
                    setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                    data.pop()
                    
                }
                // console.log('first games data')
                // console.log(data)
                setGames(data);
                setFetchedGamesStart(data.length)
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
                console.log(data.length)
                console.log(data)
                if (data[0]?.status){
                    console.log(data[0])
                    setRateMess(data[0].status.message)
                    

                    // data.pop()
                    setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                    // setErr(data[0]);
                    
                }
                if (data.status){
                    setFetchedGamesStart(0)
                    setRateMess(data.status.message);
                    setButton(false)
                    setLoading(false)
                    return
                    
                }
                // rate error in for example 15 of 20 games
                if(data[data.length -1]?.status){
                    setRateMess(data[data.length -1].status.message);
                    setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                    data.pop()
                    
                }
                // console.log(data)
                try{
                    setGames([...games, ...data]);
                }catch (error) {
                    if (error instanceof TypeError) {
                        setGames(data);       
                    }
                }
                setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                // console.log(games)
                // console.log('fetching more data')
            }
        
        ).catch((error) => {
            console.log('Error fetching games data:', error)
            let catchError
            if (error.status){
                catchError = error
            } else{
                catchError = 
                {
                    "status": {
                        "message": "Something went wrong",
                        "status_code": 2137,
                    }
                }
            }
            
            
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
                rateMess={rateMess}
                setRateMess={setRateMess}
                seconds={seconds}
                setSeconds={setSeconds}
                cooldown={cooldown}
                setCoolDown={setCoolDown}
                

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
                setRateMess={setRateMess}
                seconds={seconds}
                setSeconds={setSeconds}
                cooldown={cooldown}
                setCoolDown={setCoolDown}

            />
            
            
        </div>
    )
}
export default Profile;