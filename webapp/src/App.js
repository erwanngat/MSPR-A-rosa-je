import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';  
/*ALL PAGE */
import Home from './pages/Home';  
import Login from './pages/Login';
import Profil from './pages/Profil';
import Inscription from './pages/Inscription';

import logo from './logo-aro.jpg';

//const navigate = useNavigate();  
///////////////////


/*END */
const NavBar = () => (
  
  <div className="navbar">
    <img src={logo} alt='logo' className='logo'></img>
    <Link to="/">Main Page</Link> |
    <Link to="/Profil">Profile</Link> |
    <Link to="/Inscription">Inscription</Link>
    <Link to="/Login">Login</Link> |
  </div>
);

function App() {
  //const navigate = useNavigate();

  
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Inscription" element={<Inscription />} />

          <Route path="/" element={ <><NavBar /><Home /></> } />
          <Route path="/Profil" element={<> <NavBar />  <Profil /> </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;