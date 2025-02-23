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

    // Données de l'utilisateur à inscrire
    const userData = {
      name,
      email,
      phone,
      password,
    };

    try {
      // Appel de la méthode register pour créer un compte
      const isRegistered = await UserService().register(userData, passwordConfirmation);

      if (isRegistered) {
        // Message de succès après l'inscription
        setMessage('Compte créé avec succès !');
        // Redirection vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Erreur lors de la création du compte. Veuillez réessayer.');
      }
    } catch (error) {
      // Message d'erreur en cas de problème
      setMessage('Erreur lors de la création du compte. Veuillez réessayer.');
      console.error('Erreur lors de la création du compte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>

      {/* Affichage du message de confirmation ou d'erreur */}
      {message && <div>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Téléphone :</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;