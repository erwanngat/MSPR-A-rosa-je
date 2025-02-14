import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { email, password });
    // Ajouter la logique de soumission du formulaire
    navigate('/');  
    sessionStorage.setItem('email', email);

  };

  return (
    <div className="login-containe0r bg-login">
      <div className="login-form">
        <h2>A'Rosa-je</h2>
        
        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="username">Email :</label>
            <input 
              type="email" 
              id="username" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required
            />
          </div>


          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required
            />
          </div>
          <a href="/Inscription">Don't have acount?</a>

          <button type="submit" className="login-btn">Log In</button>
          
          <div className="forgot-password">
            <a href="/">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
