import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink to='/Home'>Home</NavLink></li>
      <li><NavLink to='/About'>About</NavLink></li>

    </ul>
  </nav>
);

const Main = () => (
  <Routes>
    <Route path='/Home' element={<Home />} />
    <Route path='/About' element={<About />} />
  </Routes>
);

function App() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
    <div>
      <Navigation />
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
      <Main />
    </div>
  )
}

export default App;