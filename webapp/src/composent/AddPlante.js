import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts';
import AddPlanteDialog from '../composent/dialogs/AddPlanteDialog';
import EditPlanteDialog from '../composent/dialogs/EditPlanteDialog';

const MyPlants = () => {
  const [plantes, setPlantes] = useState([]);
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fonction pour ouvrir la boîte de dialogue d'ajout
  const openAddDialog = () => setIsAddDialogOpen(true);

  // Fonction pour ouvrir la boîte de dialogue de modification
  const openEditDialog = (plante) => {
    setSelectedPlante(plante);
    setIsEditDialogOpen(true);
  };

  // Fonction pour ajouter une plante
  const handleAdd = async (planteData) => {
    const newPlante = await PlantesService().addPlante(planteData);
    setPlantes([...plantes, newPlante]);
  };

  // Fonction pour mettre à jour une plante
  const handleUpdate = async (planteData) => {
    const updatedPlante = await PlantesService().updatePlante(selectedPlante.id, planteData);
    setPlantes(plantes.map((p) => (p.id === updatedPlante.id ? updatedPlante : p)));
  };

  return (
    <div>
      <h1>Mes Plantes</h1>
      <button onClick={openAddDialog}>Ajouter une plante</button>

      {/* Liste des plantes */}
      {plantes.map((plante) => (
        <div key={plante.id} onClick={() => openEditDialog(plante)}>
          <p>{plante.name}</p>
        </div>
      ))}

      {/* Boîtes de dialogue */}
      <AddPlanteDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAdd}
      />
      <EditPlanteDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        plante={selectedPlante}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default MyPlants;