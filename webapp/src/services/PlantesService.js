const PlantesService = () => {
    const baseUrl = 'http://localhost:8080/api/'; 
  
    const getToken = () => {
      return sessionStorage.getItem('token');
    };
  
    const getPlantes = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${baseUrl}plantes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des plantes');
        }
        console.log(response);
  
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error('Erreur dans getPlantes:', error);
        throw error;
      }
    };
  
    // Récupérer une plante par son ID
    const getPlantesById = async (id) => {
      try {
        const token = getToken();
        const response = await fetch(`${baseUrl}plantes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
          },
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la plante');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erreur dans getPlantesById:', error);
        throw error;
      }
    };
    const getPlantesByUserId = async (id) => {
      try {
        const token = getToken();
        const response = await fetch(`${baseUrl}users/${id}/plantes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
          },
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la plante');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erreur dans getPlantesById:', error);
        throw error;
      }
    };
  
    const addPlante = async (planteData) => {
        try {
          const token = getToken();
          const response = await fetch(`${baseUrl}plantes`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            body: planteData, // FormData
          });
      
          if (!response.ok) {
            const errorText = await response.text(); 
            console.error('Erreur API:', errorText);
            throw new Error(`Erreur lors de l'ajout de la plante: ${errorText}`);
          }
      
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Erreur dans addPlante:', error);
          throw error;
        }
      };
  
    const updatePlante = async (id, planteData) => {
        console.log(planteData);
        console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        console.log(`${baseUrl}/${id}`);

        try {
          const token = getToken();
          console.log(token);
          const response = await fetch(`${baseUrl}plantes/${id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            body: planteData, 
          });
          
          if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour de la plante: ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log(response);
          console.log(data);
          return data;
        } catch (error) {
          console.error('Erreur dans updatePlante:', error);
          throw error;
        }
      };
  
    // Supprimer une plante
    const deletePlante = async (id) => {
      try {
        const token = getToken();
        const response = await fetch(`${baseUrl}plantes/${id}`, {
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
  
    return {
      getPlantes,
      addPlante,
      updatePlante,
      deletePlante,
      getPlantesById,
      getPlantesByUserId,
    };
  };
  
  export default PlantesService;