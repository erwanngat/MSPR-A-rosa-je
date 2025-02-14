import React , {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import { useLocation } from 'react-router-dom';

import logo from './../img/logo-aro.jpg';



const NavBar = () => {
    const navigate = useNavigate();  
    const location = useLocation();
     
    useEffect(() => {
        const currentUrl = location.pathname;
        if (sessionStorage.getItem('email') == "" && !(currentUrl == '/'|| currentUrl=='/Login'|| currentUrl=='/Register') ){
            navigate("/login");
        }

    }, [navigate]);
    if (sessionStorage.getItem('email') != "" ){
        return (
            <div className="navbar">
            <Link to="/"><img src={logo} alt='logo' className='logo'/></Link> |
            <Link to="/Profil">Profile</Link> |
            <h3> CECI Utilisateur logo </h3>
          </div>
          );
    }
    return (
        <div className="navbar">
        <Link to="/"><img src={logo} alt='logo' className='logo'/></Link> |
        <Link to="/Register">Inscription</Link>|
        <Link to="/Login">Login</Link> 
        </div>
        );
  
};

export default NavBar;