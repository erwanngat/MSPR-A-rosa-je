import React, { useEffect, useState } from 'react';
import PlantesService from '../services/PlantesService.ts';
import PlanteDialog from '../composent/dialogs/PlanteDialog'; // Composant pour la boîte de dialogue

const Test = () => {
  const [plantes, setPlantes] = useState([]); // Liste des plantes
  const [selectedPlante, setSelectedPlante] = useState(null); // Plante sélectionnée
  const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour ouvrir/fermer la boîte de dialogue

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

  // Ouvrir la boîte de dialogue avec les détails de la plante
  const openDialog = (plante) => {
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
      <h1>Liste des plantes</h1>

      {/* Liste des plantes */}
      <div style={styles.plantesGrid}>
        {plantes.map((plante) => (
          <div
            key={plante.id}
            style={styles.planteCard}
            onClick={() => openDialog(plante)}
          >
            <h3>{plante.name}</h3>
            <p>{plante.description}</p>
            <p><strong>Utilisateur:</strong> {plante.user?.name}</p>
          </div>
        ))}
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
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
};

export default Test;