import { IPlante } from "../types/plantes"; // Assurez-vous d'avoir un type IPlante défini

const plantesService = (token: string) => {
  const baseUrl = 'http://localhost:8080/api/plantes'; // URL de base de l'API


  const getPlantes = async () => {
    try {
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plantes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans getPlantes:', error);
      throw error;
    }
  };

  // Ajouter une nouvelle plante
  const addPlante = async (planteData: IPlante) => {
    console.log("token :::::::::::"+token);
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({description: planteData.description, name: planteData.name, address_id: planteData.address_id, image: planteData.image }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout de la plante: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans addPlante:', error);
      throw error;
    }
  };

  // Mettre à jour une plante existante
  const updatePlante = async (id: number, planteData: IPlante) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planteData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de la plante: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans updatePlante:', error);
      throw error;
    }
  };

  // Supprimer une plante
  const deletePlante = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de la plante: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans deletePlante:', error);
      throw error;
    }
  };

  // Récupérer les réservations d'une plante
  const getReservationsByPlanteId = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/${id}/reservations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des réservations: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans getReservationsByPlanteId:', error);
      throw error;
    }
  };

  // Récupérer les commentaires d'une plante
  const getCommentsByPlanteId = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/${id}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des commentaires: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans getCommentsByPlanteId:', error);
      throw error;
    }
  };

  return {
    getPlantes,
    addPlante,
    updatePlante,
    deletePlante,
    getReservationsByPlanteId,
    getCommentsByPlanteId,
  };
};

export default plantesService;