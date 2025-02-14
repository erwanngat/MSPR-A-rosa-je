import React  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
/*ALL PAGE */
import Home from './pages/Home';  
import Login from './pages/Login';
import Profil from './pages/Profil';
import Register from './pages/Register';
import NavBar from './composent/NavBar'

/*END */


function App() {
  sessionStorage.setItem('email', "");

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={ <><NavBar /> <Home /></> } />
          <Route path="/Login" element={<><NavBar /><Login /></>} />
          <Route path="/register" element={<><NavBar  /><Register /></>} />
          <Route path="/Profil" element={<> <NavBar />  <Profil /> </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;