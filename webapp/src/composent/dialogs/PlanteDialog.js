import React, { useEffect, useState } from 'react';
import PlantesService from '../../services/PlantesService.ts';
import UserService from '../../services/userService.ts'; // Pour récupérer les informations des utilisateurs
import CommentService from '../../services/CommentService.ts'; // Pour gérer les commentaires

const PlanteDialog = ({ plante, onClose }) => {
  const [reservations, setReservations] = useState([]); // Réservations de la plante
  const [comments, setComments] = useState([]); // Commentaires de la plante
  const [users, setUsers] = useState({}); // Cache des utilisateurs
  const [showCommentForm, setShowCommentForm] = useState(false); // Afficher le formulaire de commentaire
  const [newComment, setNewComment] = useState(''); // Texte du nouveau commentaire
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(''); // Message d'erreur

  // Récupérer les réservations, les commentaires et tous les utilisateurs
  useEffect(() => {
    if (plante) {
      fetchReservations();
      fetchComments();
      fetchAllUsers();
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
      const data = await CommentService().getCommentsByPlant(plante.id, getToken());
      setComments(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  // Récupérer tous les utilisateurs
  const fetchAllUsers = async () => {
    try {
      const data = await UserService().getAllUsers(getToken());
      const usersMap = data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      setUsers(usersMap);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  // Récupérer le token depuis le sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  // Récupérer l'ID de l'utilisateur connecté
  const getCurrentUserId = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user.id;
  };

  // Gérer l'ajout d'un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) {
      setError('Veuillez saisir un commentaire.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const commentData = {
        comment: newComment,
        plant_id: plante.id, // Plante actuelle
      };

      const success = await CommentService().addComment(commentData, getToken());
      if (success) {
        await fetchComments(); // Recharger les commentaires après l'ajout
        setNewComment(''); // Réinitialiser le champ de commentaire
        setShowCommentForm(false); // Masquer le formulaire
      } else {
        setError('Erreur lors de l\'ajout du commentaire.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      setError('Erreur lors de l\'ajout du commentaire.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>{plante.name}</h2>
        <p><strong>Description:</strong> {plante.description}</p>

        {/* Réservations de la plante */}
        <div style={styles.section}>
          <h3>Réservations</h3>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation.id} style={styles.reservationItem}>
                  <p><strong>ID:</strong> {reservation.id}</p>
                  <p><strong>Propriétaire:</strong> {users[reservation.owner_user_id]?.name || 'Inconnu'}</p>
                  <p><strong>Jardinier:</strong> {users[reservation.gardener_user_id]?.name || 'Inconnu'}</p>
                  <p><strong>Date de début:</strong> {reservation.start_date}</p>
                  <p><strong>Date de fin:</strong> {reservation.end_date}</p>
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
                  <p><strong>Utilisateur:</strong> {users[comment.user_id]?.name || 'Inconnu'}</p>
                  <p><strong>Commentaire:</strong> {comment.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun commentaire pour cette plante.</p>
          )}
        </div>

        {/* Bouton pour ajouter un commentaire */}
        <button
          onClick={() => setShowCommentForm(true)}
          style={styles.addCommentButton}
        >
          Ajouter un commentaire
        </button>

        {/* Formulaire pour ajouter un commentaire */}
        {showCommentForm && (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              placeholder="Votre commentaire"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={styles.commentInput}
            />
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.commentFormButtons}>
              <button type="submit" disabled={loading}>
                {loading ? 'En cours...' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                style={styles.cancelButton}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

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
  addCommentButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '20px',
  },
  commentForm: {
    marginTop: '20px',
  },
  commentInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  commentFormButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
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
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default PlanteDialog;