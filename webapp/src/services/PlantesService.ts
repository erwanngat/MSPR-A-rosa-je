import { IPlante } from "../types/IPlantes";

const PlantesService = () => {
  const baseUrl = 'http://localhost:8080/api/plantes'; // URL de base de l'API

  // Récupérer le token depuis le sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token'); // Assurez-vous que le token est stocké ici après la connexion
  };

  // Récupérer toutes les plantes
  const getPlantes = async () => {
    try {
      const token = getToken();
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plantes');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Erreur dans getPlantes:', error);
      throw error;
    }
  };

  const addPlante = async (planteData : IPlante) => {
    try {
      const token = getToken();
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(planteData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l\'ajout de la plante ${response}`);
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Erreur dans addPlante:', error);
      throw error;
    }
  };

  const updatePlante = async (id, planteData) => {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(planteData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la plante');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans updatePlante:', error);
      throw error;
    }
  };

  const deletePlante = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la plante');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans deletePlante:', error);
      throw error;
    }
  };

  return {
    getPlantes,
    addPlante,
    updatePlante,
    deletePlante,
  };
};

export default PlantesService;