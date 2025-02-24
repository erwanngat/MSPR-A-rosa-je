import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './styles.css'; // Assurez-vous d'importer le fichier CSS

const Profil = () => {
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur depuis sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString); // Convertir la chaîne JSON en objet

  const handleEdit = () => {
    alert("Fonction d'édition à implémenter");
    // Logique d'édition à ajouter ici
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Supprimer toutes les données de session
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <div className="profile-container bg-profil">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profile_photo_url || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="profile-avatar"
          />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>phone: {user.phone_number || 'N/A'}</p>
          {/* <p>ID: {user.id}</p> */}
          <p>Date Creat: {new Date(user.created_at).toLocaleDateString()}</p>
          <p>Updated at: {new Date(user.updated_at).toLocaleDateString()}</p>
        </div>

        <div className="profile-actions">
          {/* <button onClick={handleEdit} className="profile-btn">
            Edit Profile
          </button> */}
          <button onClick={handleLogout} className="profile-btn logout-btn">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profil;