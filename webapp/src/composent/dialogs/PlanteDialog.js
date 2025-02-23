import React, { useEffect, useState } from 'react';
import PlantesService from '../../services/PlantesService.ts';
import UserService from '../../services/userService.ts'; // Importation du service utilisateur

const PlanteDialog = ({ plante, onClose }) => {
  const [reservations, setReservations] = useState([]); // Réservations de la plante
  const [comments, setComments] = useState([]); // Commentaires de la plante
  const [user, setUser] = useState(null); // Informations de l'utilisateur

  // Récupérer les réservations, les commentaires et les informations de l'utilisateur
  useEffect(() => {
    if (plante) {
      fetchReservations();
      fetchComments();
      fetchUser();
    }
  }, [plante]);

  // Récupérer les réservations de la plante
  const fetchReservations = async () => {
    try {
      const data = await PlantesService().getReservationsByPlanteId(plante.id);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  // Récupérer les commentaires de la plante
  const fetchComments = async () => {
    try {
      const data = await PlantesService().getCommentsByPlanteId(plante.id);
      setComments(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  // Récupérer les informations de l'utilisateur
  const fetchUser = async () => {
    try {
      const userData = await UserService().getUser(getToken(), plante.user_id);
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
  };

  // Récupérer le token depuis le sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>{plante.name}</h2>
        <p><strong>Description:</strong> {plante.description}</p>
        <p><strong>Utilisateur:</strong> {user ? user.name : 'Chargement...'}</p>

        {/* Réservations de la plante */}
        <div style={styles.section}>
          <h3>Réservations</h3>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation.id} style={styles.reservationItem}>
                  <p><strong>ID:</strong> {reservation.id}</p>
                  <p><strong>Utilisateur:</strong> {reservation.userName}</p>
                  <p><strong>Date:</strong> {reservation.date}</p>
                  <p><strong>Statut:</strong> {reservation.status}</p>
                  {/* Ajoutez d'autres propriétés si nécessaire */}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune réservation pour cette plante.</p>
          )}
        </div>

        {/* Commentaires de la plante */}
        <div style={styles.section}>
          <h3>Commentaires</h3>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} style={styles.commentItem}>
                  <p><strong>ID:</strong> {comment.id}</p>
                  <p><strong>Utilisateur:</strong> {comment.userName}</p>
                  <p><strong>Texte:</strong> {comment.text}</p>
                  <p><strong>Date:</strong> {comment.date}</p>
                  {/* Ajoutez d'autres propriétés si nécessaire */}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun commentaire pour cette plante.</p>
          )}
        </div>

        {/* Bouton pour fermer la boîte de dialogue */}
        <button onClick={onClose} style={styles.closeButton}>
          Fermer
        </button>
      </div>
    </div>
  );
};

// Styles CSS en ligne
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginTop: '20px',
  },
  reservationItem: {
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
  },
  commentItem: {
    borderBottom: '1px solid #ccc',
    padding: '10px 0',
  },
  closeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default PlanteDialog;