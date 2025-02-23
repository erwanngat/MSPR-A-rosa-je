import React , {useEffect , useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import { useLocation } from 'react-router-dom';
import logo from './../img/logo-aro.jpg';

const NavBar = () => {
    const navigate = useNavigate();  
    const location = useLocation();
    const [showOptions, setShowOptions] = useState(false);
    console.log(sessionStorage.getItem('user'))
    useEffect(() => {
        const currentUrl = location.pathname;
        if (sessionStorage.getItem('user') == null && !(currentUrl == '/'|| currentUrl=='/Login'|| currentUrl=='/Register') ){
            navigate("/login");
        }

    }, [navigate]);
    const handleLogout = () => {
        sessionStorage.clear(); // Supprimer toutes les données de session
        navigate('/login'); // Rediriger vers la page de connexion
      };
    if (sessionStorage.getItem('user') != null ){
        const userString = sessionStorage.getItem('user');
        const user = JSON.parse(userString); 
        return (
            <div className="navbar">
            <Link to="/"><img src={logo} alt='logo' className='logo'/></Link> |
            {/* <Link to="/Profil">Profile</Link> | */}
            <Link to="/MyPlants">My Plantes</Link> |
            <Link to="/Test">Test</Link> |
            {/* <a href="/Profil">
                <img
                src={user.profile_photo_url }
                alt="Avatar"
                className="profile-avatar"
                />
            </a>   */}
                <div
                className="navbar"
                onMouseEnter={() => setShowOptions(true)} // Afficher les options au survol
                onMouseLeave={() => setShowOptions(false)} // Cacher les options quand la souris quitte
                >
                <img
                            src={user.profile_photo_url }
                            alt="Avatar"
                    className="profile-avatar"
                />

                {/* Afficher les options si showOptions est true */}
                {showOptions && (
                    <div className="navbar-options">
                    <Link to="/Profil">Profile</Link>
                    <button onClick={handleLogout} className="profile-btn logout-btn">
                        Log Out
                    </button>
                    </div>
                )}
            </div>      
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