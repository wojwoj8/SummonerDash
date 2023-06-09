import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import ProfileData from "./ProfileData";

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

    return(
        <div>
            
            <ProfileData
                data={data}
                solo={solo}
                flex={flex}
                err={err}
            />

            
        </div>
    )
}
export default Profile;