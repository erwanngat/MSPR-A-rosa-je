import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts'; // Importation du service

const Test = () => {
  const [plantes, setPlantes] = useState([]); // État pour stocker la liste des plantes
  const [name, setName] = useState(''); // État pour le nom de la nouvelle plante
  const [userId, setUserId] = useState(''); // État pour l'ID de l'utilisateur
  const [addressId, setAddressId] = useState(''); // État pour l'ID de l'adresse
  const [editingPlante, setEditingPlante] = useState(null); // État pour la plante en cours d'édition
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [message, setMessage] = useState(''); // État pour gérer les messages

  // Récupérer toutes les plantes au chargement de la page
  useEffect(() => {
    fetchPlantes();
  }, []);

  // Fonction pour récupérer toutes les plantes
  const fetchPlantes = async () => {
    setLoading(true);
    try {
      const data = await PlantesService().getPlantes();
      setPlantes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des plantes:', error);
      setMessage('Erreur lors de la récupération des plantes');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer une nouvelle plante
  const handleCreate = async () => {
    if (!name || !userId || !addressId) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setMessage('');

    const planteData = {
      name,
      user_id: userId,
      address_id: addressId,
    };

    try {
      const newPlante = await PlantesService().addPlante(planteData);
      setPlantes([...plantes, newPlante]); // Ajouter la nouvelle plante à la liste
      setMessage('Plante créée avec succès !');
      setName('');
      setUserId('');
      setAddressId('');
    } catch (error) {
      console.error('Erreur lors de la création de la plante:', error);
      setMessage('Erreur lors de la création de la plante');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour une plante
  const handleUpdate = async () => {
    if (!editingPlante || !name || !userId || !addressId) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setMessage('');

    const planteData = {
      name,
      user_id: userId,
      address_id: addressId,
    };

    try {
      const updatedPlante = await PlantesService().updatePlante(editingPlante.id, planteData);
      setPlantes(plantes.map((p) => (p.id === updatedPlante.id ? updatedPlante : p))); // Mettre à jour la plante dans la liste
      setMessage('Plante mise à jour avec succès !');
      setEditingPlante(null); // Réinitialiser l'édition
      setName('');
      setUserId('');
      setAddressId('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la plante:', error);
      setMessage('Erreur lors de la mise à jour de la plante');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une plante
  const handleDelete = async (id) => {
    setLoading(true);
    setMessage('');

    try {
      await PlantesService().deletePlante(id);
      setPlantes(plantes.filter((p) => p.id !== id)); // Supprimer la plante de la liste
      setMessage('Plante supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de la plante:', error);
      setMessage('Erreur lors de la suppression de la plante');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour démarrer l'édition d'une plante
  const startEditing = (plante) => {
    setEditingPlante(plante);
    setName(plante.name);
    setUserId(plante.user_id);
    setAddressId(plante.address_id);
  };

  return (
    <div>
      <h1>Gestion des Plantes</h1>

      {/* Affichage des messages */}
      {message && <div>{message}</div>}

      {/* Formulaire pour créer ou modifier une plante */}
      <div>
        <h2>{editingPlante ? 'Modifier une plante' : 'Créer une nouvelle plante'}</h2>
        <input
          type="text"
          placeholder="Nom de la plante"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID Utilisateur"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID Adresse"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
        />
        <button
          onClick={editingPlante ? handleUpdate : handleCreate}
          disabled={loading}
        >
          {loading ? 'En cours...' : editingPlante ? 'Modifier' : 'Créer'}
        </button>
        {editingPlante && (
          <button onClick={() => setEditingPlante(null)}>Annuler</button>
        )}
      </div>

      {/* Liste des plantes */}
      <div>
        <h2>Liste des Plantes</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <ul>
            {plantes.map((plante) => (
              <li key={plante.id}>
                <strong>{plante.name}</strong> (Utilisateur: {plante.user_id}, Adresse: {plante.address_id})
                <button onClick={() => startEditing(plante)}>Modifier</button>
                <button onClick={() => handleDelete(plante.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Test;