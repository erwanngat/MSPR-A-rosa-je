import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import UserService from '../services/userService.ts';  // Importer UserService

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // État pour gérer les erreurs

  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Réinitialiser l'erreur à chaque soumission

    try {
      const response = await UserService().login(email, password);
      console.log("REPONSE : ");
      console.log(response);
      if (response.token) {
        // Si la connexion est réussie, stocker le token et rediriger
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('role', response.role);

        console.log(sessionStorage.getItem("user"));
        navigate('/');  // Rediriger vers la page d'accueil
      } else {
        // Si la connexion échoue, afficher un message d'erreur
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container bg-login">
      <div className="login-form">
        <h2>A'Rosa-je</h2>
        
        {error && <div className="error-message">{error}</div>}  {/* Afficher l'erreur si elle existe */}

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
          <a href="/Register">Don't have an account?</a>

          <button type="submit" className="login-btn">Log In</button>

        </form>
      </div>
    </div>
  );
};

export default Login;