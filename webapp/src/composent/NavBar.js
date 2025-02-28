import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './../img/logo-aro.jpg';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showOptions, setShowOptions] = useState(false);
    
    useEffect(() => {
        const currentUrl = location.pathname;
        if (sessionStorage.getItem('user') == null && 
            !(currentUrl === '/' || currentUrl === '/Login' || currentUrl === '/Register')) {
            navigate("/Login");
        }
    }, [navigate, location]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/Login');
    };

    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return (
        <div className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-container">
                    <img src={logo} alt='logo' className='logo'/>
                </Link>
            </div>
            
            <div className="navbar-right">
                {user ? (
                    <>
                        <Link to="/AllPlantes" className={location.pathname === '/AllPlantes' ? 'active' : ''}>
                            All Plants
                        </Link>
                        <Link to="/MyPlants" className={location.pathname === '/MyPlants' ? 'active' : ''}>
                            My plants
                        </Link>
                        <div 
                            className="profile-container"
                            onMouseEnter={() => setShowOptions(true)}
                            onMouseLeave={() => setShowOptions(false)}
                        >
                            <img
                                src={user.profile_photo_url}
                                alt="Avatar"
                                className="profile-avatar"
                            />
                            
                            {showOptions && (
                                <div className="navbar-options">
                                    <Link to="/Profil">Profile</Link>
                                    <button onClick={handleLogout} className="logout-btn">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>

                        <Link to="/Register" className={location.pathname === '/Register' ? 'active' : ''}>
                            Register
                        </Link>
                        <Link to="/Login" className={location.pathname === '/Login' ? 'active' : ''}>
                            Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;