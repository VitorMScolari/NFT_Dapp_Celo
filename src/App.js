import React from "react";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Explore from './components/explore/Explore';
import Profile from './components/profile/Profile';
import Create from './components/create/Create';
import "./App.css";



const App = function AppWrapper() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Explore />} />
          {/*<Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />*/}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
