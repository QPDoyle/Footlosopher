import React, { useEffect, useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import About from './pages/About';
import Fixtures from './pages/Fixtures';
import TeamStats from './pages/TeamStats';
import Squads from './pages/Squads';

const Navigation = () => (
  <nav className="header">
    <div className="header-inner">
      <div className="header-left">
        <span className="logo-dot" />
        <span className="logo-text">Footlosopher</span>
      </div>
      <ul className="nav-links">
        <li><NavLink to='/Home'>Home</NavLink></li>
        <li><NavLink to='/About'>About</NavLink></li>
        <li><NavLink to='/Fixtures'>Fixtures</NavLink></li>
        <li><NavLink to='/Squads'>Squads</NavLink></li>
      </ul>
    </div>
  </nav>
);

const Main = () => (
  <Routes>
    <Route path='/Home' element={<Home />} />
    <Route path='/About' element={<About />} />
    <Route path='/Fixtures' element={<Fixtures />} />
    <Route path='/Squads' element={<Squads />} />
    <Route path='/team/:teamId' element={<TeamStats />} />
  </Routes>
);

function App() {
  return (
    <div className="app">
      <div className="noise" />
      <Navigation />
      <main className="main">
        <Main />
      </main>
    </div>
  );
}

export default App;
