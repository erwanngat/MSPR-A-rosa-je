import React , {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import logo from './../img/logo-aro.jpg';



const NavBarHome = () => {
    const navigate = useNavigate();  

    const sessionEmail = sessionStorage.getItem('email');
    console.log(sessionEmail)
    useEffect(() => {
        if (sessionEmail != null){
            //navigate("/login");
        }

    }, [navigate]);
    
  return (
    <div className="navbar">
    <Link to="/"><img src={logo} alt='logo' className='logo'/></Link> |
    
    <Link to="/Inscription">Inscription</Link>|
    <Link to="/Login">Login</Link> 
  </div>
  );
};

export default NavBarHome;