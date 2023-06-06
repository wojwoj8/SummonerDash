import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";

const Profile = () =>{
    
    const [data, setData] = useState([{}])

    const {name} = useParams()
    // console.log(name)

    useEffect(() =>{
        fetchData()
    }, [])

    const fetchData = async () =>{
        fetch(`/name/${name}`).then(
            res => res.json()
          ).then(
            data =>{
                setData(data)
                // console.log(data)
            }
          )
    }
    return(
        <div>
            {(typeof data.name === 'undefined')?(
                <p>loading...</p>
                ):(
                <p>{data.name}</p>
                )
            }
        </div>
    )
}
export default Profile;