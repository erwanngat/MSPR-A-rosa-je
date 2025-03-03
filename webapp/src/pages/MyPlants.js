import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService';
import ReservationService from '../services/ReservationService.ts'; // Importer le service de réservation
import AddPlanteDialog from '../composent/dialogs/AddPlanteDialog';
import EditPlanteDialog from '../composent/dialogs/EditPlanteDialog';

const MyPlants = () => {
  const [plantes, setPlantes] = useState([]);
  const [filteredPlantes, setFilteredPlantes] = useState([]); // Plantes filtrées par user_id
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [currentPlanteId, setCurrentPlanteId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reservationsByPlant, setReservationsByPlant] = useState({}); // Stocker les réservations par plante

  // Récupérer l'ID de l'utilisateur connecté depuis sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user.id;
  const token = sessionStorage.getItem('token'); // Récupérer le token d'authentification

  useEffect(() => {
    fetchPlantes();
  }, []);
  useEffect(() => {
    if (filteredPlantes.length > 0) {
      filteredPlantes.forEach((plante) => {
        fetchReservationsForPlant(plante.id);
      });
    }
  }, [filteredPlantes]);

  const fetchPlantes = async () => {
    try {
      const data = await PlantesService().getPlantes();
      setPlantes(data);

      const userPlantes = data.filter((plante) => plante.user_id === userId);
      setFilteredPlantes(userPlantes);
    } catch (error) {
      console.error('Erreur lors de la récupération des plantes:', error);
    }
  };

  // Récupérer les réservations pour une plante spécifique
  const fetchReservationsForPlant = async (plantId) => {
    try {
      const reservations = await ReservationService().getReservationsByPlant(plantId, token);
      setReservationsByPlant((prev) => ({
        ...prev,
        [plantId]: reservations,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  // Ouvrir la boîte de dialogue d'ajout
  const openAddDialog = () => setIsAddDialogOpen(true);

  // Ouvrir la boîte de dialogue de modification
  const openEditDialog = (plante) => {
    setSelectedPlante(plante);
    setIsEditDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de réservation
  const openReservationDialog = (planteId) => {
    setCurrentPlanteId(planteId);
    setIsReservationDialogOpen(true);
  };

  // Fermer la boîte de dialogue de réservation
  const closeReservationDialog = () => {
    setIsReservationDialogOpen(false);
    setStartDate('');
    setEndDate('');
  };

  // Gérer la création d'une réservation
  const handleCreateReservation = async () => {
    if (!currentPlanteId || !startDate || !endDate) {
      alert('Veuillez remplir toutes les dates.');
      return;
    }

    const reservation = {
      //gardener_user_id: null, // À définir selon la logique de l'application
      plante_id: currentPlanteId,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const success = await ReservationService().addReservation(reservation, token);
      if (success) {
        alert('Réservation créé avec succès !');
        // Recharger les réservations pour cette plante
        await fetchReservationsForPlant(currentPlanteId);
        closeReservationDialog();
      } else {
        alert('Erreur lors de la création de la réservation.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Une erreur est survenue.');
    }
  };

  // Gérer l'ajout réussi d'une plante
  const handleAddSuccess = (newPlante) => {
    setPlantes([...plantes, newPlante]);
    setFilteredPlantes([...filteredPlantes, newPlante]);
  };

  // Gérer la mise à jour réussie d'une plante
  const handleUpdateSuccess = (updatedPlante) => {
    const updatedPlantes = plantes.map((p) => (p.id === updatedPlante.id ? updatedPlante : p));
    setPlantes(updatedPlantes);
    setFilteredPlantes(updatedPlantes.filter((p) => p.user_id === userId));
  };

  // Gérer la suppression réussie d'une plante
  const handleDeleteSuccess = (planteId) => {
    const updatedPlantes = plantes.filter((p) => p.id !== planteId);
    setPlantes(updatedPlantes);
    setFilteredPlantes(updatedPlantes.filter((p) => p.user_id === userId));
  };

  return (
    <div className="my-plants-container">
      <button onClick={openAddDialog} className="my-plants-add-button">
        Add new Plant
      </button>

      {/* Conteneur pour les plantes et les boutons */}
      <div className="my-plants-list">
        {filteredPlantes.map((plante) => (
          <div key={plante.id} className="my-plants-item">
            <div className="my-plants-plante-card" onClick={() => openEditDialog(plante)}>
              <img
                src={plante.image != null ? plante.image : "https://media.discordapp.net/attachments/1313422181556027394/1343955211659645009/aHlicmlk.png?ex=67c078d3&is=67bf2753&hm=5347bc6f83fa7f74e608cdcbffe4571d79691ae44bba16bb09ff1bb4616636bf&=&format=webp&quality=lossless" }
                alt={plante.name}
                className="my-plants-plante-image"
              />
              <p className="my-plants-plante-name">{plante.name}</p>
              <p>{plante.description}</p>
            </div>
            <button
              onClick={() => openReservationDialog(plante.id)}
              className="my-plants-info-button"
              disabled={reservationsByPlant[plante.id]?.length > 0} // Désactiver le bouton si déjà réservé
            >
              {reservationsByPlant[plante.id]?.length >= 1 ? 'Kept' : 'To Keep'}
            </button>
          </div>
        ))}
      </div>

      {/* Boîtes de dialogue */}
      <AddPlanteDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddSuccess={handleAddSuccess}
      />
      <EditPlanteDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        plante={selectedPlante}
        onUpdateSuccess={handleUpdateSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Boîte de dialogue de réservation */}
      {isReservationDialogOpen && (
        <div className="my-plants-reservation-dialog">
          <div className="my-plants-reservation-dialog-content">
            <h2>Créer une réservation pour la plante ID: {currentPlanteId}</h2>
            <div>
              <label>Date de début:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>Date de fin:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button onClick={handleCreateReservation}>Confirmer</button>
            <button onClick={closeReservationDialog}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlants;
