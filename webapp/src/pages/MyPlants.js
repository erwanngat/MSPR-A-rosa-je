import React, { useState, useEffect } from 'react';
import PlantesService from '../services/PlantesService.ts'; // Importation du service

const MyPlants = () => {
  const [plantes, setPlantes] = useState([]); // État pour stocker toutes les plantes
  const [filteredPlantes, setFilteredPlantes] = useState([]); // État pour stocker les plantes filtrées
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const [selectedPlante, setSelectedPlante] = useState(null); // État pour la plante sélectionnée
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState(''); // État pour gérer les erreurs
  const [dialogOpen, setDialogOpen] = useState(false); // État pour ouvrir/fermer la boîte de dialogue
  const [name, setName] = useState(''); // État pour le nom de la plante en édition
  const [addressId, setAddressId] = useState(''); // État pour l'ID de l'adresse en édition
  const [isAddingNew, setIsAddingNew] = useState(false); // État pour savoir si on ajoute une nouvelle plante

  // Récupérer l'ID de l'utilisateur connecté depuis sessionStorage
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user.id; // ID de l'utilisateur connecté

  // Récupérer toutes les plantes de l'utilisateur au chargement de la page
  useEffect(() => {
    fetchPlantes();
  }, []);

  // Filtrer les plantes en fonction de la barre de recherche
  useEffect(() => {
    const filtered = plantes.filter((plante) =>
      plante.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlantes(filtered);
  }, [searchTerm, plantes]);

  // Fonction pour récupérer toutes les plantes de l'utilisateur
  const fetchPlantes = async () => {
    setLoading(true);
    try {
      const data = await PlantesService().getPlantes(); // Récupérer toutes les plantes
      const userPlantes = data.filter((plante) => plante.user_id === userId); // Filtrer par utilisateur
      setPlantes(userPlantes);
      setFilteredPlantes(userPlantes);
    } catch (error) {
      console.error('Erreur lors de la récupération des plantes:', error);
      setError('Erreur lors de la récupération des plantes');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la boîte de dialogue avec les détails de la plante
  const openDialog = (plante) => {
    setSelectedPlante(plante);
    setName(plante.name);
    setAddressId(plante.address_id);
    setIsAddingNew(false); // Désactiver le mode ajout
    setDialogOpen(true);
  };

  // Fonction pour fermer la boîte de dialogue
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedPlante(null);
    setName('');
    setAddressId('');
    setIsAddingNew(false); // Réinitialiser le mode ajout
  };

  // Fonction pour fermer la boîte de dialogue lorsqu'on clique en dehors
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  };

  // Fonction pour mettre à jour une plante
  const handleUpdate = async () => {
    if (!selectedPlante || !name || !addressId) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    const planteData = {
      name,
      user_id: userId, // Utiliser l'ID de l'utilisateur connecté
      address_id: addressId,
    };

    try {
      const updatedPlante = await PlantesService().updatePlante(selectedPlante.id, planteData);
      setPlantes(plantes.map((p) => (p.id === updatedPlante.id ? updatedPlante : p)));
      setFilteredPlantes(filteredPlantes.map((p) => (p.id === updatedPlante.id ? updatedPlante : p)));
      setSelectedPlante(updatedPlante);
      setError('Plante mise à jour avec succès !');
      closeDialog(); // Fermer la boîte de dialogue après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la plante:', error);
      setError('Erreur lors de la mise à jour de la plante');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une plante
  const handleDelete = async () => {
    if (!selectedPlante) {
      setError('Aucune plante sélectionnée.');
      return;
    }
  
    setLoading(true);
    setError(`Plante supprimé : ${selectedPlante.name}`);
  
    try {
      await PlantesService().deletePlante(selectedPlante.id);
      closeDialog(); // Fermer la boîte de dialogue après la suppression
      
    } catch (error) {
      fetchPlantes(); 
      console.error('Erreur lors de la suppression de la plante:', error);
      //setError('Erreur lors de la suppression de la plante'); // Afficher l'erreur uniquement en cas d'échec
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle plante
  const handleAdd = async () => {
    if (!name || !addressId) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    const planteData = {
      name,
      user_id: userId, // Utiliser l'ID de l'utilisateur connecté
      address_id: addressId,
    };

    try {
      const newPlante = await PlantesService().addPlante(planteData);
      setPlantes([...plantes, newPlante]);
      setFilteredPlantes([...filteredPlantes, newPlante]);
      setError('Plante ajoutée avec succès !');
      closeDialog(); // Fermer la boîte de dialogue après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
      setError('Erreur lors de l\'ajout de la plante');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir la boîte de dialogue en mode ajout
  const openAddDialog = () => {
    setSelectedPlante(null);
    setName('');
    setAddressId('');
    setIsAddingNew(true); // Activer le mode ajout
    setDialogOpen(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mes Plantes</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une plante..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

      {/* Affichage des messages */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Liste des plantes */}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div style={styles.plantesGrid}>
          {filteredPlantes.map((plante) => (
            <div
              key={plante.id}
              style={styles.planteCard}
              onClick={() => openDialog(plante)}
            >
              <img
                src="https://s3-alpha-sig.figma.com/img/1431/9e48/80ec1bccb575003f30796046cac5a12c?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TVRbPcbJpfzbEgBlLGf8xxyh2HpbRf4oB1kA4sjoLWfGg0sNHr9dNWo4jnZbWHLlgEmf4dlS9eg8N9UeNIgWnNK50im1NePXktHn~sQkEVV530-aZHuKGKLQH54-cE~fH8dDm03TYMDp0dRG~WSz3HlX5h6P879XPQaFXm~UUSC3C5SFpyKRHO5kqP~6UBZzdabNqfHy5JWrWHordj6kVnd6TDsjpseovBdS5wnxkMDV6GkWFvOsqHp~aL16yoRvdzWlMhuHecn-ni71D4GfvmwQc-8d7B0T566oZ8jDGNpwVzZinHkrwGum4ABXNGxHRpIgy-i6z~1hgYrJ2bwNOw__" // Image par défaut
                alt={plante.name}
                style={styles.planteImage}
              />
              <p style={styles.planteName}>{plante.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bouton pour ajouter une nouvelle plante */}
      <button onClick={openAddDialog} style={styles.addButton}>
        Ajouter une plante
      </button>

      {/* Boîte de dialogue */}
      {dialogOpen && (
        <div style={styles.dialogOverlay} onClick={handleOverlayClick}>
          <div style={styles.dialog}>
            <h2>{isAddingNew ? 'Ajouter une plante' : 'Détails de la Plante'}</h2>
            <input
              type="text"
              placeholder="Nom de la plante"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="ID Adresse"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              style={styles.input}
            />
            <div style={styles.dialogButtons}>
              {isAddingNew ? (
                <button onClick={handleAdd} style={styles.button} disabled={loading}>
                  {loading ? 'En cours...' : 'Ajouter'}
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} style={styles.button} disabled={loading}>
                    {loading ? 'En cours...' : 'Modifier'}
                  </button>
                  <button onClick={handleDelete} style={styles.button} disabled={loading}>
                    {loading ? 'En cours...' : 'Supprimer'}
                  </button>
                </>
              )}
              <button onClick={closeDialog} style={styles.button}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles CSS en ligne
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative', // Pour positionner le bouton d'ajout
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
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
  button: {
    padding: '10px 20px',
    marginRight: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  addButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  dialogOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  dialogButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
};

export default MyPlants;