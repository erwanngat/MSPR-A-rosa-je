import React  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
/*ALL PAGE */
import Home from './pages/Home';  
import Login from './pages/Login';
import Profil from './pages/Profil';
import Register from './pages/Register';
import NavBar from './composent/NavBar'
import Test from './pages/Test'

import MyPlants from './pages/MyPlants'
import AllPlantes from './pages/AllPlantes'
import { Chat } from '@mui/icons-material';


/*END */


function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={ <><NavBar /> <Home /></> } />
          <Route path="/Login" element={<><NavBar /><Login /></>} />
          <Route path="/register" element={<><NavBar  /><Register /></>} />
          <Route path="/Profil" element={<> <NavBar />  <Profil /> </>} />
          <Route path="/test" element={<> <NavBar />  <Test /> </>} />
          <Route path="/MyPlants" element={<> <NavBar />  <MyPlants /> </>} />
          <Route path="/AllPlantes" element={<> <NavBar />  <AllPlantes /> </>} />
          <Route path="/Chat" element={<> <NavBar />  <Chat /> </>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;