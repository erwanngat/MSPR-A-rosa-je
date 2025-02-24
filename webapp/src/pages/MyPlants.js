import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts';
import AddPlanteDialog from '../composent/dialogs/AddPlanteDialog';
import EditPlanteDialog from '../composent/dialogs/EditPlanteDialog';

const MyPlants = () => {
  const [plantes, setPlantes] = useState([]);
  const [filteredPlantes, setFilteredPlantes] = useState([]); // Plantes filtrées par user_id
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Récupérer l'ID de l'utilisateur connecté depuis sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user.id;

  // Récupérer les plantes au chargement du composant
  useEffect(() => {
    fetchPlantes();
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

  // Ouvrir la boîte de dialogue d'ajout
  const openAddDialog = () => setIsAddDialogOpen(true);

  // Ouvrir la boîte de dialogue de modification
  const openEditDialog = (plante) => {
    setSelectedPlante(plante);
    setIsEditDialogOpen(true);
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
    <div style={styles.container}>
      <h1 style={styles.title}>My plants</h1>
      <button onClick={openAddDialog} style={styles.addButton}>
        Add new Plant
      </button>

      {/* Grille des plantes */}
      <div style={styles.plantesGrid}>
        {filteredPlantes.map((plante) => (
          <div
            key={plante.id}
            style={styles.planteCard}
            onClick={() => openEditDialog(plante)}
          >
            <img
              src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__"
              alt={plante.name}
              style={styles.planteImage}
            />
            <p style={styles.planteName}>{plante.name}</p>
            <p >{plante.description}</p>
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
  addButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
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
    padding: '10px',
    width: '150px',
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

export default MyPlants;