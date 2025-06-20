import React, { useState } from 'react';
import UserService from '../services/userService.ts'; // Importation du service
import { useNavigate } from 'react-router-dom'; // Pour la redirection après l'inscription

const Register = () => {
  const navigate = useNavigate();

  // États pour stocker les valeurs du formulaire
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [message, setMessage] = useState(''); // État pour gérer les messages

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    if (!name || !email || !phone || !password || !passwordConfirmation) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirmation) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setMessage('');

    const userData = {
      name,
      email,
      phone,
      password,
    };

    try {
      const isRegistered = await UserService().register(userData, passwordConfirmation);

      if (isRegistered) {
        // Message de succès après l'inscription
        setMessage('Compte créé avec succès !');
        // Redirection vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Error');
      }
    } catch (error) {
      setMessage('Error');
      // console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-login">
        <div className="login-form">
          <h2>A'Rosa-je</h2>

          {message && <div>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name :</label>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>

            <div className="input-group">
              <label>Email :</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div className="input-group">
              <label>Phone number :</label>
              <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
              />
            </div>

            <div className="input-group">
              <label>Password :</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            <div className="input-group">
              <label>Confirmation password:</label>
              <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
              />
            </div>
            <div>
              <a href="/login">Have an account</a>
            </div>
            <div>
              <button type="submit" className="login-btn">Register</button>
            </div>
          </form>


        </div>
      </div>
  );
};

export default Register;
