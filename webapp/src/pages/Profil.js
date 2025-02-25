import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Profil = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer l'utilisateur depuis l'état de la route ou la session
  const user = location.state?.user || JSON.parse(sessionStorage.getItem('user'));

  // Vérifier si l'utilisateur provient de location.state (appelé avec props)
  const isCalledWithProps = !!location.state?.user;

  const handleEdit = () => {
    alert("Fonction d'édition à implémenter");
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Supprimer toutes les données de session
    navigate('/login'); // Rediriger vers la page de connexion
  };

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

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
          <p>Phone: {user.phone_number || 'N/A'}</p>

          {/* Afficher les dates uniquement si la page n'est pas appelée avec props */}
          {!isCalledWithProps && (
            <>
              <p>Date Creat: {new Date(user.created_at).toLocaleDateString()}</p>
              <p>Updated at: {new Date(user.updated_at).toLocaleDateString()}</p>
            </>
          )}
        </div>

        {/* Afficher le bouton "Log Out" uniquement si la page n'est pas appelée avec props */}
        {!isCalledWithProps && (
          <div className="profile-actions">
            <button onClick={handleLogout} className="profile-btn logout-btn">
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;