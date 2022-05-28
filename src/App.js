import React from "react";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/navbar/Navigation';
import Explore from './components/explore/Explore';
import Profile from './components/profile/Profile';
import Create from './components/create/Create';
import "./App.css";



const App = function AppWrapper() {

  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
