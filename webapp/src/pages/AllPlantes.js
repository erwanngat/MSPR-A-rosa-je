import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts';
import UserService from '../services/userService.ts'; // Pour récupérer les informations des utilisateurs
import PlanteDialog from '../composent/dialogs/PlanteDialog'; // Boîte de dialogue pour afficher les détails de la plante

const AllPlantes = () => {
  const [plantes, setPlantes] = useState([]); // Liste de toutes les plantes
  const [selectedPlante, setSelectedPlante] = useState(null); // Plante sélectionnée
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
  const openDialog = async (plante) => {
    setSelectedPlante(plante);
    setIsDialogOpen(true);
  };

  // Fermer la boîte de dialogue
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlante(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All plants</h1>

      {/* Grille des plantes */}
      <div style={styles.plantesGrid}>
        {plantes.map((plante) => {
          const user = users[plante.user_id]; 
          if (!user) {
            fetchUser(plante.user_id);
          }

          return (
            <div
              key={plante.id}
              style={styles.planteCard}
              onClick={() => openDialog(plante)}
            >
              <img
                src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"
                alt={plante.name}
                style={styles.planteImage}
              />
              <p style={styles.planteName}>{plante.name}</p>
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
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

// Styles CSS en ligne
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  plantesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  planteCard: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  planteImage: {
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  planteName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default AllPlantes;