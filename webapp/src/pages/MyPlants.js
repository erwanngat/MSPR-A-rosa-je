import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts';
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

  // Récupérer les plantes au chargement du composant
  useEffect(() => {
    fetchPlantes();
  }, []);

  // Récupérer les réservations pour chaque plante
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

      // Filtrer les plantes pour n'afficher que celles de l'utilisateur connecté
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
      owner_user_id: userId, // L'utilisateur connecté est le propriétaire
      gardener_user_id: null, // À définir selon la logique de l'application
      plante_id: currentPlanteId,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const success = await ReservationService().addReservation(reservation, token);
      if (success) {
        alert('Réservation créée avec succès !');
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
      <h1 className="my-plants-title">My plants</h1>
      <button onClick={openAddDialog} className="my-plants-add-button">
        Add new Plant
      </button>

      {/* Conteneur pour les plantes et les boutons */}
      <div className="my-plants-list">
        {filteredPlantes.map((plante) => (
          <div key={plante.id} className="my-plants-item">
            <div className="my-plants-plante-card">
              <img
                src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"
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
              {reservationsByPlant[plante.id]?.length >= 1 ? 'Déjà réservé' : 'Show ID'}
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

// Styles CSS supplémentaires
/*
.my-plants-reservation-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.my-plants-reservation-dialog-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.my-plants-reservation-dialog-content input {
    margin: 10px 0;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.my-plants-reservation-dialog-content button {
    margin: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
}

.my-plants-reservation-dialog-content button:hover {
    background-color: #0056b3;
}

.my-plants-info-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
    */