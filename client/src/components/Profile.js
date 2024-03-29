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

    // count of fetched and displayed games
    const [fetchedGamesStart, setFetchedGamesStart] = useState(0);

    //for disabling load more button while updating data
    const [button, setButton] = useState(false)

    //handling rate error without rendering error page
    const [rateMess, setRateMess] = useState("");

    // for update and load more data (profile games and profile data)
    const [seconds, setSeconds] = useState(0);
    const [cooldown, setCoolDown] = useState(false);
    // gamesData
    const [games, setGames] = useState({});

    // loading for fetch games button and recent games data
    const [display, setDisplay] = useState('block');

    //loading for reload games button
    const [loading, setLoading] = useState(false);

    // state of last rendered games
    const [lastGamesWinratio, setLastGamesWinratio] = useState({
        'Defeat': 0,
        'Victory': 0,
        'Remake': 0,
    });
    const [role, setRole] = useState({
        'TOP': 0,
        'JUNGLE': 0,
        'MIDDLE': 0,
        'BOTTOM': 0,
        'UTILITY': 0,

    })

    // searched username
    const query = useParams();

    useEffect(() =>{
        fetchUserData();
    }, [])

    
    const handleError = (error) =>{
        
        const [statusCode, statusText] = error.message.split(' - ');

        const errorObject = {
          status: {
            message: statusText.trim(),
            status_code: parseInt(statusCode.trim()),
          },
        };
        setErr(errorObject)
    }
 

    const fetchUserData = async () =>{
        fetch(`/userData/${query.region}/${query.name}`).then((res) => {
            console.log(res)
            if (!res.ok) {
                throw new Error(`${res.status} - ${res.statusText}`); // Throw an error with the status code
            }
            return res.json();
          })
          .then((data) => {
            
                if (data[0]?.status){
                    setErr(data[0]);
                    return
                }
                document.title = `${query.name} - SummonerDash`;
                setData(data[0])
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
                fetchGamesData();
                
            }
          ).catch((error) => {
            console.log('Error fetching user data:', error)
            handleError(error)
        }
        );
    }

    const fetchGamesData = async () =>{
        fetch(`/gamesData/${query.region}/${query.name}/0`).then((res) => {
            if (!res.ok) {
                console.log('test')
                throw new Error(`${res.status} - ${res.statusText}`); // Throw an error with the status code
            }
            return res.json();
          }).then(
            
            data=>{
                
                if (data[0]?.status){
                    
                    setErr(data[0]);
                    return
                    
                    
                }
                if (data.status){
                    setFetchedGamesStart(0)
                    setRateMess(data.status.message);
                    setButton(false)
                    setLoading(false)
                    // this makes error on purpose and doesn't set games data 
                    // data.pop()
                    
                }
                else if(data[data.length -1]?.status){
                    setRateMess(data[data.length -1].status.message);
                    setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                    data.pop()
                    
                }
                else{
                    setGames(data);
                    setFetchedGamesStart(data.length)
                    setButton(false)
                    setLoading(false)
                }
                
                
            }
        ).catch((error) => {
            console.log('Error fetching games data:', error)
            handleError(error)
        }
        );
    }

    const fetchMoreGamesData = async () =>{
        fetch(`/gamesData/${query.region}/${query.name}/${fetchedGamesStart}`).then((res) => {
            if (!res.ok) {
                throw new Error(`${res.status} - ${res.statusText}`); // Throw an error with the status code
            }
            return res.json();
          }).then(
            data=>{
                if (data[0]?.status){
                    setRateMess(data[0].status.message)
                    setFetchedGamesStart(prev => fetchedGamesStart + data.length)
                    
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
                try{
                    setGames([...games, ...data]);
                }catch (error) {
                    if (error instanceof TypeError) {
                        setGames(data);       
                    }
                }
                setFetchedGamesStart(prev => fetchedGamesStart + data.length)
            }
        
        ).catch((error) => {
            console.log('Error fetching games data:', error)
            handleError(error)
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
        console.log(err)
        document.title = "SummonerDash";
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
                button={button}
                loading={loading}
                masteries={masteries}
                rateMess={rateMess}
                setRateMess={setRateMess}
                seconds={seconds}
                setSeconds={setSeconds}
                cooldown={cooldown}
                setCoolDown={setCoolDown}
                lastGamesWinratio={lastGamesWinratio}
                fetchedGamesStart={fetchedGamesStart}
                role={role}
                setRole={setRole}
                display={display}
                

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
                setLastGamesWinratio={setLastGamesWinratio}
                lastGamesWinratio={lastGamesWinratio}
                role={role}
                setRole={setRole}
                

            />
            
            
        </div>
    )
}
export default Profile;