import React, { useState, useEffect } from 'react';
import PlantesService from '../../services/PlantesService.ts';

const EditPlanteDialog = ({ isOpen, onClose, plante, onUpdateSuccess, onDeleteSuccess }) => {
  const [name, setName] = useState(plante ? plante.name : '');
  const [addressId, setAddressId] = useState(plante ? plante.address_id : '');
  const [description, setDescription] = useState(plante ? plante.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mettre à jour les champs lorsque la plante change
  useEffect(() => {
    if (plante) {
      setName(plante.name);
      setAddressId(plante.address_id);
      setDescription(plante.description);
    }
  }, [plante]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !addressId || !description) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API pour mettre à jour la plante
      const updatedPlante = await PlantesService().updatePlante(plante.id, {
        name,
        address_id: addressId,
        description,
      });

      // Notifier le parent (MyPlants) que la mise à jour a réussi
      onUpdateSuccess(updatedPlante);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plante) return;

    setLoading(true);
    setError('');

    try {
      // Appel API pour supprimer la plante
      await PlantesService().deletePlante(plante.id);

      // Notifier le parent (MyPlants) que la suppression a réussi
      onDeleteSuccess(plante.id);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de la suppression de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.dialog}>
        <h2>Modifier la plante</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom de la plante"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="ID Adresse"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Description de la plante"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <div style={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? 'En cours...' : 'Modifier'}
            </button>
            <button type="button" onClick={handleDelete} disabled={loading}>
              {loading ? 'En cours...' : 'Supprimer'}
            </button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    borderRadius: '8px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default EditPlanteDialog;