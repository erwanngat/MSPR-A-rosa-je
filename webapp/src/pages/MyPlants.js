import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts';
import ReservationService from '../services/reservationService.ts'; // Import du service de réservation
import AddPlanteDialog from '../composent/dialogs/AddPlanteDialog';
import EditPlanteDialog from '../composent/dialogs/EditPlanteDialog';
import AddReservationDialog from '../composent/dialogs/AddReservationDialog'; // Nouvelle boîte de dialogue pour les réservations

const MyPlants = () => {
  const [plantes, setPlantes] = useState([]);
  const [filteredPlantes, setFilteredPlantes] = useState([]);
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [reservations, setReservations] = useState([]); // État pour stocker les réservations

  // Récupérer l'ID de l'utilisateur connecté depuis sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user.id;
  const token = user.token; // Récupérer le token pour l'authentification

  // Récupérer les plantes et les réservations au chargement du composant
  useEffect(() => {
    fetchPlantes();
    fetchReservations();
  }, []);

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

  const fetchReservations = async () => {
    try {
      const data = await ReservationService().getReservationsByUser(userId, token); // Supposons que cette méthode existe
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  // Ouvrir la boîte de dialogue d'ajout de réservation
  const openReservationDialog = (plante) => {
    setSelectedPlante(plante);
    setIsReservationDialogOpen(true);
  };

  // Gérer la création d'une réservation
  const handleCreateReservation = async (startDate, endDate) => {
    try {
      const reservation = {
        owner_user_id: userId,
        gardener_user_id: null, // À adapter selon ton modèle
        plante_id: selectedPlante.id,
        start_date: startDate,
        end_date: endDate,
      };

      const success = await ReservationService().addReservation(reservation, token);
      if (success) {
        fetchReservations(); // Rafraîchir la liste des réservations
        setIsReservationDialogOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  // Vérifier si une réservation existe pour une plante donnée
  const hasReservation = (planteId) => {
    return reservations.some((reservation) => reservation.plante_id === planteId);
  };

  return (
    <div className="my-plants-container">
      <h1 className="my-plants-title">My plants</h1>
      <button onClick={openAddDialog} className="my-plants-add-button">
        Add new Plant
      </button>

      {/* Grille des plantes */}
      <div className="my-plants-plantes-grid">
        {filteredPlantes.map((plante) => (
          <div key={plante.id} className="my-plants-plante-card">
            <img
              src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"
              alt={plante.name}
              className="my-plants-plante-image"
            />
            <p className="my-plants-plante-name">{plante.name}</p>
            <p>{plante.description}</p>
            <button
              onClick={() => openReservationDialog(plante)}
              disabled={hasReservation(plante.id)}
              className="reservation-button"
            >
              {hasReservation(plante.id) ? 'Keep' : 'To Keep'}
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
      <AddReservationDialog
        isOpen={isReservationDialogOpen}
        onClose={() => setIsReservationDialogOpen(false)}
        onCreateReservation={handleCreateReservation}
      />
    </div>
  );
};

export default MyPlants;