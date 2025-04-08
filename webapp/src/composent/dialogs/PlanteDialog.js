import React, { useEffect, useState } from 'react';
import UserService from '../../services/userService.ts';
import CommentService from '../../services/CommentService.ts';
import { useNavigate } from 'react-router-dom';


const PlanteDialog = ({ plante, userPlante, reservation = null , onClose }) => {
  const [comments, setComments] = useState([]);
  const [usersCache, setUsersCache] = useState({});
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
      fetchComments();
    }
  }, [plante]);
  useEffect(() => {
    comments.forEach((comment) => {
      fetchUser(comment.user_id);
    });
  }, [comments]); 


  const fetchComments = async () => {
    try {
      const data = await CommentService().getCommentsByPlant(plante.id);
      setComments(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  const fetchUser = async (userId) => {
    if (usersCache[userId]!== undefined) return usersCache[userId];  
    try {
      const userData = await UserService().getUser(userId);
      setUsersCache((prevUsers) => ({ ...prevUsers, [userId]: userData }));
      return userData;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
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

      const success = await CommentService().addComment(commentData);
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
    navigate('/Profil', { state: { user: userPlante, reservation : reservation } });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-large" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{plante.name}</h2>
        
        <img
          src={plante.image != null ? plante.image : "./../img/default-plant.png"}
          className="plante-image"
          alt={plante.name}
        />
        
        <p><strong>Description:</strong> {plante.description}</p>
        
        <button onClick={handleNavigateToProfil} className="btn btn-primary">
          Get in touch
        </button>

        {/* Section Commentaires */}
        <div className="dialog-section">
          <h3 className="section-title">Comments</h3>
          <div className="card-container">
            {comments.length > 0 ? (
              comments.map((comment) => {
                //const user = usersCache[comment.user_id];
                let user = usersCache[comment.user_id]; 
                if (!user) {
                  user = fetchUser(plante.user_id);
                }

                return (
                  <div key={comment.id} className="card">
                    <img src={user.profile_photo_url} alt="Avatar" className="profile-avatar2"/><span className="card-strong">{user ? user.name : 'Chargement...'}</span>
                    {/* <p className="card-text"></p> */}
                    <p className="card-text">{comment.comment}</p>
                    <p className="card-text"><span className="card-strong">Date:</span> {formatDate(comment.created_at)}</p>
                  </div>
                );
              })
            ) : (
              <p>No comment for this plant.</p>
            )}
          </div>
        </div>

        {sessionStorage.getItem('role') == "botaniste" && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="btn btn-primary"
          >
            Add a comment
          </button>
        )}

        {showCommentForm && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Votre commentaire"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            {error && <div className="error-message">{error}</div>}
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'En cours...' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button onClick={onClose} className="btn btn-danger">
          Close
        </button>
      </div>
    </div>
  );
};


export default PlanteDialog;