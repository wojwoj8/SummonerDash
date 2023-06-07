import {React, useState, useEffect } from 'react';  
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import Profile from './components/Profile';
import StartPage from './components/StartPage';
import Navbar from './components/Navbar';
import './App.scss';

function App() {
  
  return (
    
      {/* have to check if data loaded */},

      {/* {(typeof data.name === 'undefined')?(
        <p>loading...</p>
        ):(
          <p>{data.name}</p>
        )
      } */},
    <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<StartPage
          // data={data}
          // setData={setData}
          ></StartPage>}></Route>
          <Route path="name/:name" element={<Profile
          // data={data}

          ></Profile>}></Route>
        </Routes>
    </BrowserRouter>
      
  )
}

export default App;
