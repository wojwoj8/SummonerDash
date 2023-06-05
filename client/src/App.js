import {React, useState, useEffect } from 'react';  
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Profile from './components/Profile';
import StartPage from './components/StartPage';

function App() {
  const [data, setData] = useState([{}])

  useEffect(() =>{
    fetch("/name/data").then(
      res => res.json()
    ).then(
      data =>{
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    
      {/* have to check if data loaded */},

      {/* {(typeof data.name === 'undefined')?(
        <p>loading...</p>
        ):(
          <p>{data.name}</p>
        )
      } */},
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage></StartPage>}></Route>
          <Route path="name/:name" element={<Profile></Profile>}></Route>
        </Routes>
    </BrowserRouter>
      
  )
}

export default App;
