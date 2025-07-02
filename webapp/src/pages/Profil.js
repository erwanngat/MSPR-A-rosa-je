import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReservationService from '../services/ReservationService'; // Importer le service de réservation

const Profil = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer l'utilisateur depuis l'état de la route ou la session
  const user = location.state?.user || JSON.parse(sessionStorage.getItem('user'));
  const reservation = location.state?.reservation || null;

  // Vérifier si l'utilisateur provient de location.state (appelé avec props)
  const isCalledWithProps = !!location.state?.user;

  const handleEdit = () => {
    alert("Fonction d'édition à implémenter");
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Supprimer toutes les données de session
    navigate('/Login'); // Rediriger vers la page de connexion
  };

  // Fonction pour mettre à jour la réservation
  const updateReservation = async () => {
    if (!reservation) return;

    try {
      const token = sessionStorage.getItem('token');
      const tmpUser = JSON.parse(sessionStorage.getItem('user'));
      const updatedReservation = {
        ...reservation,
        gardener_user_id: tmpUser.id, // Ajouter 1 à gardener_user_id
      };
      console.log("Reservation :")
      console.log(updateReservation);
      //console.log(reservation);

      const success = await ReservationService().updateReservation(
        reservation.id,
        updatedReservation,
      );
      console.log(success);

      if (success) {

        //alert('Réservation mise à jour avec succès !');
        // Mettre à jour l'affichage en rechargeant la réservation
        //navigate(0); // Recharger la page pour refléter les changements
      } else {
        alert('Échec de la mise à jour de la réservation.');
      }
    } catch (error) {
      // console.error('Erreur lors de la mise à jour de la réservation:', error);
      alert('Une erreur est survenue lors de la mise à jour de la réservation.');
    }
  };

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <div className="profile-container bg-profil">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profile_photo_url}
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

        {/* Afficher les informations de la réservation si l'utilisateur est passé en props */}
        {isCalledWithProps && reservation && (
          <div className="reservation-details">
            <h3>Reservation</h3>
            {/* <p><strong>Plante ID:</strong> {reservation.plante_id}</p> */}
            <p><strong>Start:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
            <p><strong>Gardener:</strong> {reservation.gardener_user_id}</p>

            {/* Bouton pour mettre à jour la réservation */}
            {/* {reservation.gardener_user_id == null && (
              <button onClick={updateReservation} className="btn">
              Keep plant
            </button>
            )} */}
          </div>
        )}

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