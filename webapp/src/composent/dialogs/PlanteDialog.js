import React, { useEffect, useState } from 'react';
import PlantesService from '../../services/PlantesService.ts';
import UserService from '../../services/userService.ts';
import CommentService from '../../services/CommentService.ts';
import { useNavigate } from 'react-router-dom';


const PlanteDialog = ({ plante, userPlante, onClose }) => {
  const [reservations, setReservations] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (plante) {
      fetchReservations();
      fetchComments();
    }
  }, [plante]);
  useEffect(() => {
    // Charger les informations des utilisateurs pour les réservations
    // reservations.forEach((reservation) => {
    //   fetchUser(reservation.owner_user_id);
    //   fetchUser(reservation.gardener_user_id);
    // });

    // Charger les informations des utilisateurs pour les commentaires
    comments.forEach((comment) => {
      fetchUser(comment.user_id);
    });
  }, [reservations, comments]);

  const fetchReservations = async () => {
    try {
      const data = await PlantesService().getReservationsByPlanteId(plante.id);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await CommentService().getCommentsByPlant(plante.id, getToken());
      setComments(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  const fetchUser = async (userId) => {
    if (users[userId]) {
      return users[userId];
    }
    try {
      const userData = await UserService().getUser(getToken(), userId);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
      return userData;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  };
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

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
        plant_id: plante.id,
      };

      const success = await CommentService().addComment(commentData, getToken());
      if (success) {
        await fetchComments();
        setNewComment('');
        setShowCommentForm(false);
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
  const handleNavigateToProfil = () => {
    navigate('/Profil', { state: { user: userPlante } });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>{plante.name} ({userPlante.name})</h2>
        <img
          src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"
          alt={plante.name}
          style={styles.planteImage}
        />
        <p><strong>Description:</strong> {plante.description}</p>
        <button onClick={handleNavigateToProfil}>
           Get in touch
        </button>

        {/* Réservations de la plante */}
        {/* <div style={styles.section}>
          <h3>Reservations</h3>
          <div style={styles.cardContainer}>
            {reservations.length > 0 ? (
              reservations.map((reservation) => {
                const ownerName = users[reservation.owner_user_id]?.name || 'Loading...';
                const gardenerName = users[reservation.gardener_user_id]?.name || 'Loading...';

                return (
                  <div key={reservation.id} style={styles.card}>
                   <p><strong>ID:</strong> {reservation.id}</p>
                    <p><strong>Owner:</strong> {ownerName}</p>
                    <p><strong>Gardener:</strong> {gardenerName}</p>
                    <p><strong>Start date:</strong> {formatDate(reservation.start_date)}</p>
                    <p><strong>End date:</strong> {formatDate(reservation.end_date)}</p>
                  </div>
                );
              })
            ) : (
              <p>No reservation for this plant.</p>
            )}
          </div>
        </div> */}

        {/* Commentaires de la plante */}
        <div style={styles.section}>
          <h3>Comments</h3>
          <div style={styles.cardContainer}>
            {comments.length > 0 ? (
              comments.map((comment) => {
                const userName = users[comment.user_id]?.name || 'Loading...';

                return (
                  <div key={comment.id} style={styles.card}>
                    <p><strong>{userName}</strong> </p>
                    <p>{comment.comment}</p>
                    <p><strong>Date:</strong> {formatDate(comment.created_at)}</p>
                  </div>
                );
              })
            ) : (
              <p>No comment for this plant.</p>
            )}
          </div>
        </div>

        {/* Bouton pour ajouter un commentaire */}
        { sessionStorage.getItem('roles') == "botaniste" &&(
        <button
          onClick={() => setShowCommentForm(true)}
          style={styles.addCommentButton}
        >
          Add a comment
        </button>
        )}

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
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Bouton pour fermer la boîte de dialogue */}
        <button onClick={onClose} style={styles.closeButton}>
          Close
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
    width: '800px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  planteImage: {
    maxWidth: '100%',
    maxHeight: '400px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  section: {
    marginTop: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    flex: '1 1 calc(50% - 20px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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