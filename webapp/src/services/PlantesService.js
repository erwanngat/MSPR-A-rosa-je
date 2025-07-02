const PlantesService = () => {
    const baseUrl = 'http://localhost:8080/api/'; 
  
    const getToken = () => {
      return sessionStorage.getItem('token');
    };
  
    const getPlantes = async () => {
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

        const data = await response.json();
        return data;

    };
  
    const getPlantesById = async (id) => {
        const token = getToken();
        const response = await fetch(`${baseUrl}plantes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la plante');
        }
  
        const data = await response.json();
        return data;

    };
    const getPlantesByUserId = async (id) => {
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

    };
  
    const addPlante = async (planteData) => {
        try {
          const token = getToken();
          const response = await fetch(`${baseUrl}plantes`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            body: planteData,
          });
      
          if (!response.ok) {
            const errorText = await response.text(); 

          }
      
          const data = await response.json();
          return data;
        } catch (error) {

        }
      };
  
    const updatePlante = async (id, planteData) => {
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

        }
      };
  
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