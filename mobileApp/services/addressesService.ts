import { IAddress } from "../types/address"; // Assurez-vous d'avoir un type IAddress défini

const addressesService = () => {
  const baseUrl = 'http://localhost:8080/api/addresses'; // URL de base de l'API

  // Récupérer le token depuis le sessionStorage
  const getToken = () => {
    return sessionStorage.getItem('token'); // Assurez-vous que le token est stocké ici après la connexion
  };

  // Récupérer toutes les adresses
  const getAddresses = async () => {
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
        throw new Error('Erreur lors de la récupération des adresses');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Erreur dans getAddresses:', error);
      // throw error;
    }
  };

  // Créer une nouvelle adresse
  const createAddress = async (addressData: IAddress) => {
    try {
      const token = getToken();
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création de l'adresse: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Erreur dans createAddress:', error);
      // throw error;
    }
  };

  // Mettre à jour une adresse existante
  const updateAddress = async (id: number, addressData: IAddress) => {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'adresse: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Erreur dans updateAddress:', error);
      // throw error;
    }
  };

  // Supprimer une adresse
  const deleteAddress = async (id: number) => {
    try {
      const token = getToken();
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de l'adresse: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Erreur dans deleteAddress:', error);
      // throw error;
    }
  };

  return {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};

export default addressesService;