import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService';
import UserService from '../services/userService.ts'; 
import ReservationService from '../services/ReservationService'; 
import PlanteDialog from '../composent/dialogs/PlanteDialog';

const AllPlantes = () => {
  const [plantes, setPlantes] = useState([]); // all plants
  const [filteredPlantes, setFilteredPlantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlante, setSelectedPlante] = useState(null); 
  const [selectedUserPlante, setselectedUserPlante] = useState(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [usersCache, setUsersCache] = useState({}); // Dictionary Users (cache)
  const [reservations, setReservations] = useState([]); // État pour stocker les réservations
  const [showReservedPlantes, setShowReservedPlantes] = useState(false); 
  const [selectedReservation, setSelectedReservation] = useState(null); // Réservation associée à la plante sélectionnée

  useEffect(() => {
    fetchPlantes();
    fetchReservations();
  }, []);

  const fetchPlantes = async () => {
    try {
      const data = await PlantesService().getPlantes();
      setPlantes(data);
      setFilteredPlantes(data); // Initialisation
    } catch (error) {
      // console.error('Erreur lors de la récupération des plantes:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const data = await ReservationService().getAllReservations();
      setReservations(data);
    } catch (error) {
      // console.error('Erreur lors de la récupération des réservations:', error);
    }
  };

  const fetchUser = async (userId) => {
    if (usersCache[userId] !== undefined) return usersCache[userId]; // Return if already in cache
    try {
      const userData = await UserService().getUser(userId);
      setUsersCache(prevCache => ({
        ...prevCache,
        [userId]: userData
      }));
      return userData;
    } catch (error) {
      // console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  };

  const openDialog = async (plante, user) => {
    setSelectedPlante(plante);
    setselectedUserPlante(user);

    // find plant reservation
    const reservation = reservations.find((res) => res.plante_id === plante.id);
    setSelectedReservation(reservation || null);

    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlante(null);
    setSelectedReservation(null); 
  };

  // Filter plants
  useEffect(() => {
    let filtered = plantes;
    if (searchTerm) {
      filtered = filtered.filter((plante) =>
        plante.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showReservedPlantes) {
      const reservedPlanteIds = reservations.map((res) => res.plante_id);
      filtered = filtered.filter((plante) => reservedPlanteIds.includes(plante.id));
    }

    setFilteredPlantes(filtered);
  }, [searchTerm, plantes, reservations, showReservedPlantes]);

  return (
    <div className="all-plantes-container">
      {/* Barre de recherche */}
      <div className="all-plantes-search-container">
        <input
          type="text"
          placeholder="Rechercher une plante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="all-plantes-search-bar"
        />
      </div>

      {/* Bouton pour basculer entre les modes d'affichage */}
      <div className="toggle-reserved-plantes">
        <button
          onClick={() => setShowReservedPlantes(!showReservedPlantes)}
          //className={`toggle-button ${showReservedPlantes ? 'active' : ''}`}
          className='btn'
        >
          {showReservedPlantes ? 'Show all plants' : 'Show reserved plants'}
        </button>
      </div>
      <br/>

      {/* Grille des plantes */}
      <div className="all-plantes-plantes-grid">
        {filteredPlantes.map((plante) => {
          let user = usersCache[plante.user_id]; 
          if (!user) {
            user = fetchUser(plante.user_id);
          }

          return (
            <div
              key={plante.id}
              className="all-plantes-plante-card"
              onClick={() => openDialog(plante, user)}
            >
              <img
                src={plante.image != null ? plante.image : "./../img/default-plant.png" }
                alt={plante.name}
                className="all-plantes-plante-image"
              />
              <p className="all-plantes-plante-name">{plante.name}</p>
              <p>{plante.description}</p>
              <p>
                <strong>User:</strong> {user ? user.name : 'Chargement...'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Section pour afficher les réservations */}
      {/* <div className="reservations-container">
        <h2>Réservations</h2>
        {reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id}>
                <p><strong>Plante ID:</strong> {reservation.plante_id}</p>
                <p><strong>Début:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
                <p><strong>Fin:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
                <p><strong>Jardinier:</strong> {reservation.gardener_user_id}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune réservation trouvée.</p>
        )}
      </div> */}

      {/* Boîte de dialogue pour afficher les détails de la plante */}
      {isDialogOpen && (
        <PlanteDialog
          plante={selectedPlante}
          userPlante={selectedUserPlante}
          reservation={selectedReservation} // Passer la réservation associée
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

export default AllPlantes;