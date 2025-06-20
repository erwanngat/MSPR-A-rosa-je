import { IPlante } from "../types/plantes"; // Assurez-vous d'avoir un type IPlante défini

const plantesService = (token: string) => {
  const baseUrl = 'http://localhost:8080/api/plantes'; // URL de base de l'API
  const baseUrlUser = 'http://localhost:8080';

  const getPlantesById = async (id: number) => {
    try {
      console.log(`${baseUrl}/${id}`);
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        //throw new Error('Erreur lors de la récupération des plantes');
      }

      const data = await response.json();
      console.log('bedore' + data);
      return data;
    } catch (error) {
      //console.error('Erreur dans getPlantes:', error);
      //throw error;
    }
  };

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
        //throw new Error('Erreur lors de la récupération des plantes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      //console.error('Erreur dans getPlantes:', error);
      //throw error;
    }
  };

  const getPlantesByUserId = async (id: number) => {
    console.log(`${baseUrlUser}/users/${id}/plantes`);
    try {
      const response = await fetch(`${baseUrlUser}/api/users/${id}/plantes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        //throw new Error('Erreur lors de la récupération des plantes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      //console.error('Erreur dans getPlantes:', error);
      return []
    }
  };

  // Ajouter une nouvelle plante
  const addPlante = async (formData: FormData) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return response;
    } catch (error) {
      //console.error('Erreur dans addPlante:', error);
      //throw error;
    }
  }

  // Mettre à jour une plante existante
  const updatePlante = async (id: number, formData: FormData) => {
    try {
      // Vérifiez le contenu de FormData avant envoi (pour débogage)
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          // N'incluez PAS 'Content-Type' - il sera automatiquement défini
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      // Obtenez le corps de la réponse pour le débogage
      const responseText = await response.text();
      
      // Si la réponse n'est pas OK, loggez l'erreur complète
      if (!response.ok) {
        //console.error('Réponse du serveur:', responseText);
        return { ok: false, text: responseText };
      }
  
      // Si le texte n'est pas vide, essayez de l'analyser comme du JSON
      const data = responseText ? JSON.parse(responseText) : {};
      return { ok: true, data };
    } catch (error) {
      //console.error('Erreur dans updatePlante:', error);
      //throw error;
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
        //throw new Error(`Erreur lors de la suppression de la plante: ${response.statusText}`);
      }
    } catch (error) {
      //console.error('Erreur dans deletePlante:', error);
      //throw error;
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
        //throw new Error(`Erreur lors de la récupération des réservations: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      //console.error('Erreur dans getReservationsByPlanteId:', error);
      //throw error;
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
        //throw new Error(`Erreur lors de la récupération des commentaires: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      //console.error('Erreur dans getCommentsByPlanteId:', error);
      //throw error;
    }
  };

  return {
    getPlantes,
    addPlante,
    updatePlante,
    deletePlante,
    getReservationsByPlanteId,
    getCommentsByPlanteId,
    getPlantesByUserId,
    getPlantesById,
  };
};

export default plantesService;