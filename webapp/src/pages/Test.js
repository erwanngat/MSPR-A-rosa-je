import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';

const Test = () => {
  const [reservations, setReservations] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newReservation, setNewReservation] = useState({
    owner_user_id: 0,
    gardener_user_id: 0,
    plante_id: 0,
    start_date: '',
    end_date: '',
  });

  // Récupérer le token d'authentification depuis sessionStorage
  const token = sessionStorage.getItem('token');

  // Récupérer toutes les réservations au chargement de la page
  useEffect(() => {
    fetchAllReservations();
  }, []);

  // Fonction pour récupérer toutes les réservations
  const fetchAllReservations = async () => {
    try {
      // Supposons que vous avez un endpoint pour récupérer toutes les réservations
      const response = await fetch('http://localhost:8081/api/reservations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reservations');

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  // Ouvrir la boîte de dialogue d'ajout
  const openAddDialog = () => setIsAddDialogOpen(true);

  // Ouvrir la boîte de dialogue de modification
  const openEditDialog = (reservation) => {
    setSelectedReservation(reservation);
    setIsEditDialogOpen(true);
  };

  // Fermer les boîtes de dialogue
  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedReservation(null);
    setNewReservation({
      owner_user_id: 0,
      gardener_user_id: 0,
      plante_id: 0,
      start_date: '',
      end_date: '',
    });
  };

  // Gérer la création d'une réservation
  const handleCreateReservation = async () => {
    if (!newReservation.plante_id || !newReservation.start_date || !newReservation.end_date) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const success = await ReservationService().addReservation(newReservation, token);
      if (success) {
        alert('Réservation créée avec succès !');
        await fetchAllReservations();
        closeDialogs();
      } else {
        alert('Erreur lors de la création de la réservation.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Une erreur est survenue.');
    }
  };

  // Gérer la mise à jour d'une réservation
  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;

    try {
      const success = await ReservationService().updateReservation(selectedReservation.id, selectedReservation, token);
      if (success) {
        alert('Réservation mise à jour avec succès !');
        await fetchAllReservations();
        closeDialogs();
      } else {
        alert('Erreur lors de la mise à jour de la réservation.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      alert('Une erreur est survenue.');
    }
  };

  // Gérer la suppression d'une réservation
  const handleDeleteReservation = async (reservationId) => {
    try {
      const success = await ReservationService().deleteReservation(reservationId, token);
      if (success) {
        alert('Réservation supprimée avec succès !');
        await fetchAllReservations();
      } else {
        alert('Erreur lors de la suppression de la réservation.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="test-container">
      <h1>Gestion des Réservations</h1>
      <button onClick={openAddDialog} className="add-button">
        Ajouter une Réservation
      </button>

      {/* Liste des réservations */}
      <div className="reservations-list">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-item">
            <p>ID: {reservation.id}</p>
            <p>Plante ID: {reservation.plante_id}</p>
            <p>Propriétaire ID: {reservation.owner_user_id}</p>
            <p>Jardinier ID: {reservation.gardener_user_id}</p>
            <p>Date de début: {new Date(reservation.start_date).toLocaleDateString()}</p>
            <p>Date de fin: {new Date(reservation.end_date).toLocaleDateString()}</p>
            <button onClick={() => openEditDialog(reservation)}>Modifier</button>
            <button onClick={() => handleDeleteReservation(reservation.id)}>Supprimer</button>
          </div>
        ))}
      </div>

      {/* Boîte de dialogue d'ajout */}
      {isAddDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <h2>Ajouter une Réservation</h2>
            <div>
              <label>Propriétaire ID:</label>
              <input
                type="number"
                value={newReservation.owner_user_id}
                onChange={(e) => setNewReservation({ ...newReservation, owner_user_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Jardinier ID:</label>
              <input
                type="number"
                value={newReservation.gardener_user_id}
                onChange={(e) => setNewReservation({ ...newReservation, gardener_user_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Plante ID:</label>
              <input
                type="number"
                value={newReservation.plante_id}
                onChange={(e) => setNewReservation({ ...newReservation, plante_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Date de début:</label>
              <input
                type="date"
                value={newReservation.start_date}
                onChange={(e) => setNewReservation({ ...newReservation, start_date: e.target.value })}
              />
            </div>
            <div>
              <label>Date de fin:</label>
              <input
                type="date"
                value={newReservation.end_date}
                onChange={(e) => setNewReservation({ ...newReservation, end_date: e.target.value })}
              />
            </div>
            <button onClick={handleCreateReservation}>Confirmer</button>
            <button onClick={closeDialogs}>Annuler</button>
          </div>
        </div>
      )}

      {/* Boîte de dialogue de modification */}
      {isEditDialogOpen && selectedReservation && (
        <div className="dialog">
          <div className="dialog-content">
            <h2>Modifier la Réservation</h2>
            <div>
              <label>Propriétaire ID:</label>
              <input
                type="number"
                value={selectedReservation.owner_user_id}
                onChange={(e) => setSelectedReservation({ ...selectedReservation, owner_user_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Jardinier ID:</label>
              <input
                type="number"
                value={selectedReservation.gardener_user_id}
                onChange={(e) => setSelectedReservation({ ...selectedReservation, gardener_user_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Plante ID:</label>
              <input
                type="number"
                value={selectedReservation.plante_id}
                onChange={(e) => setSelectedReservation({ ...selectedReservation, plante_id: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Date de début:</label>
              <input
                type="date"
                value={selectedReservation.start_date}
                onChange={(e) => setSelectedReservation({ ...selectedReservation, start_date: e.target.value })}
              />
            </div>
            <div>
              <label>Date de fin:</label>
              <input
                type="date"
                value={selectedReservation.end_date}
                onChange={(e) => setSelectedReservation({ ...selectedReservation, end_date: e.target.value })}
              />
            </div>
            <button onClick={handleUpdateReservation}>Confirmer</button>
            <button onClick={closeDialogs}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;

// Styles CSS
