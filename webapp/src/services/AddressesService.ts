import { IAddress } from "../types/IAddress"; // Assurez-vous d'avoir un type IAddress défini

const AddressesService = () => {
  const baseUrl = 'http://localhost:8080/api/addresses';
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  const getAddresses = async () => {
     const token = getToken();
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des adresses');
      }

      const data = await response.json();
      return data;

  };

  const createAddress = async (addressData: IAddress) => {
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

  };

  const updateAddress = async (id: number, addressData: IAddress) => {
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

  };
  const deleteAddress = async (id: number) => {
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

  };

  return {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};

export default AddressesService;