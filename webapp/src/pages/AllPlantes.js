import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService';
import UserService from '../services/userService.ts'; // Pour récupérer les informations des utilisateurs
import PlanteDialog from '../composent/dialogs/PlanteDialog'; // Boîte de dialogue pour afficher les détails de la plante

const AllPlantes = () => {
  const [plantes, setPlantes] = useState([]); // Liste de toutes les plantes
  const [filteredPlantes, setFilteredPlantes] = useState([]); // Liste des plantes filtrées
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [selectedPlante, setSelectedPlante] = useState(null); // Plante sélectionnée
  const [selectedUserPlante, setselectedUserPlante] = useState(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour ouvrir/fermer la boîte de dialogue
  const [users, setUsers] = useState({}); // Cache des utilisateurs pour éviter de les récupérer plusieurs fois

  // Récupérer toutes les plantes au chargement de la page
  useEffect(() => {
    fetchPlantes();
  }, []);

  // Fonction pour récupérer toutes les plantes
  const fetchPlantes = async () => {
    try {
      const data = await PlantesService().getPlantes();
      setPlantes(data);
      setFilteredPlantes(data); // Initialiser les plantes filtrées avec toutes les plantes
    } catch (error) {
      console.error('Erreur lors de la récupération des plantes:', error);
    }
  };

  // Récupérer les informations de l'utilisateur associé à une plante
  const fetchUser = async (userId) => {
    if (users[userId]) return users[userId]; // Utiliser le cache si l'utilisateur est déjà récupéré

    try {
      const userData = await UserService().getUser(getToken(), userId);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData })); // Mettre à jour le cache
      return userData;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  };

  // Récupérer le token depuis le sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  // Ouvrir la boîte de dialogue avec les détails de la plante
  const openDialog = async (plante, user) => {
    setSelectedPlante(plante);
    setselectedUserPlante(user);
    setIsDialogOpen(true);
  };

  // Fermer la boîte de dialogue
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlante(null);
  };

  // Filtrer les plantes en fonction du terme de recherche
  useEffect(() => {
    const filtered = plantes.filter((plante) =>
      plante.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlantes(filtered);
  }, [searchTerm, plantes]);

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

      {/* Grille des plantes */}
      <div className="all-plantes-plantes-grid">
        {filteredPlantes.map((plante) => {
          const user = users[plante.user_id]; 
          if (!user) {
            fetchUser(plante.user_id);
          }

          return (
            <div
              key={plante.id}
              className="all-plantes-plante-card"
              onClick={() => openDialog(plante, user)}
            >
              <img
                src={plante.image != null ? plante.image : "https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"}
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

      {/* Boîte de dialogue pour afficher les détails de la plante */}
      {isDialogOpen && (
        <PlanteDialog
          plante={selectedPlante}
          userPlante={selectedUserPlante}
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

export default AllPlantes;