import React, { useState } from 'react';
import PlantesService from '../../services/PlantesService.ts';

const AddPlanteDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [addressId, setAddressId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !addressId || !description) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API pour ajouter une plante
      const newPlante = await PlantesService().addPlante({
        name,
        address_id: addressId,
        description,
      });

      // Notifier le parent (MyPlants) que l'ajout a réussi
      onAddSuccess(newPlante);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.dialog}>
        <h2>Ajouter une plante</h2>
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
              {loading ? 'En cours...' : 'Ajouter'}
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

export default AddPlanteDialog;