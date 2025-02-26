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
        const response = await fetch(`${baseUrl}/${id}`, {
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
  
    // Ajouter une nouvelle plante
    const addPlante = async (planteData) => {
        try {
          const token = getToken();
          const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Pas besoin de 'Content-Type' pour FormData
            },
            body: planteData, // Utiliser directement FormData
          });
      
          if (!response.ok) {
            const errorText = await response.text(); // Lire le texte de la réponse
            console.error('Erreur API:', errorText); // Afficher l'erreur
            throw new Error(`Erreur lors de l'ajout de la plante: ${errorText}`);
          }
      
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Erreur dans addPlante:', error);
          throw error;
        }
      };
  
    // Mettre à jour une plante existante
    const updatePlante = async (id, planteData) => {
        console.log(planteData);

        try {
          const token = getToken();
          const formData = new FormData(); // Utiliser FormData pour gérer les fichiers
      
          // Ajouter les champs de la plante à FormData
          for (const key in planteData) {
            if (planteData[key] !== undefined) {
              formData.append(key, planteData[key]);
            }
          }
      
          // Si une image est incluse, l'ajouter à FormData
          if (planteData.image) {
            formData.append('image', planteData.image); // 'image' doit correspondre au nom attendu par votre API
          }
      
          const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`, // Pas besoin de 'Content-Type' pour FormData
            },
            body: formData, // Utiliser FormData comme corps de la requête
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
    };
  };
  
  export default PlantesService;