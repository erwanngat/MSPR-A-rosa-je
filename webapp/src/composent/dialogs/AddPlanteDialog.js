import React, { useState, useEffect } from 'react';
import PlantesService from '../../services/PlantesService.ts';
import AddressesService from '../../services/AddressesService.ts'; // Importation du service des adresses
import Select from 'react-select'; // Importation de react-select

const AddPlanteDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [addressId, setAddressId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]); // Liste des adresses
  const [selectedAddress, setSelectedAddress] = useState(null); // Adresse sélectionnée
  const [showAddressForm, setShowAddressForm] = useState(false); // Afficher le formulaire d'adresse
  const [newAddress, setNewAddress] = useState({ // Données de la nouvelle adresse
    country: '',
    city: '',
    zip_code: '',
    street: '',
    additional_address_details: '',
  });

  // Récupérer toutes les adresses au chargement du composant
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await AddressesService().getAddresses();
        setAddresses(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  // Options pour le dropdown (format attendu par react-select)
  const addressOptions = addresses.map((address) => ({
    value: address.id, // ID de l'adresse
    label: `${address.street}, ${address.city}, ${address.country}`, // Affichage dans le dropdown
  }));

  // Gérer la sélection d'une adresse
  const handleAddressChange = (selectedOption) => {
    setSelectedAddress(selectedOption);
    setAddressId(selectedOption ? selectedOption.value : ''); // Mettre à jour l'ID de l'adresse
  };

  // Gérer les changements dans le formulaire de création d'adresse
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  // Créer une nouvelle adresse
  const handleCreateAddress = async () => {
    try {
      const createdAddress = await AddressesService().createAddress(newAddress);
      setAddresses([...addresses, createdAddress]); // Ajouter la nouvelle adresse à la liste
      setSelectedAddress({ value: createdAddress.id, label: `${createdAddress.street}, ${createdAddress.city}, ${createdAddress.country}` }); // Sélectionner la nouvelle adresse
      setAddressId(createdAddress.id); // Mettre à jour l'ID de l'adresse
      setShowAddressForm(false); // Masquer le formulaire d'adresse
    } catch (error) {
      console.error('Erreur lors de la création de l\'adresse:', error);
      setError('Erreur lors de la création de l\'adresse.');
    }
  };

  // Gérer la soumission du formulaire de création de plante
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !addressId || !description) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API pour ajouter une plante
      const newPlante = await PlantesService().addPlante({
        name,
        address_id: addressId,
        description,
      });

      // Notifier le parent (MyPlants) que l'ajout a réussi
      onAddSuccess(newPlante);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fermer la boîte de dialogue si l'utilisateur clique sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-plante-dialog-overlay" onClick={handleOverlayClick}>
      <div className="add-plante-dialog-dialog">
        <h2>Add plant</h2>
        {error && <div className="add-plante-dialog-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Plant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="add-plante-dialog-input"
          />
          <div className="add-plante-dialog-address-section">
            <Select
              placeholder="Select adress"
              options={addressOptions}
              value={selectedAddress}
              onChange={handleAddressChange}
              isSearchable // Activer la recherche
              noOptionsMessage={() => "No address found"} // Message si aucune option
              styles={customStyles} // Styles personnalisés
            />
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="add-plante-dialog-create-button"
            >
              Create
            </button>
          </div>
          {/* Formulaire de création d'adresse */}
          {showAddressForm && (
            <div className="add-plante-dialog-address-form">
              <input
                type="text"
                name="country"
                placeholder="country"
                value={newAddress.country}
                onChange={handleAddressInputChange}
                className="add-plante-dialog-input"
              />
              <input
                type="text"
                name="city"
                placeholder="city"
                value={newAddress.city}
                onChange={handleAddressInputChange}
                className="add-plante-dialog-input"
              />
              <input
                type="text"
                name="zip_code"
                placeholder="Post code"
                value={newAddress.zip_code}
                onChange={handleAddressInputChange}
                className="add-plante-dialog-input"
              />
              <input
                type="text"
                name="street"
                placeholder="street"
                value={newAddress.street}
                onChange={handleAddressInputChange}
                className="add-plante-dialog-input"
              />
              <input
                type="text"
                name="additional_address_details"
                placeholder="Further details"
                value={newAddress.additional_address_details}
                onChange={handleAddressInputChange}
                className="add-plante-dialog-input"
              />
              <button
                type="button"
                onClick={handleCreateAddress}
                className="add-plante-dialog-create-address-button"
              >
                Create adress
              </button>
            </div>
          )}
          <textarea
            placeholder="Description of the plant"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="add-plante-dialog-textarea"
          />
          <div className="add-plante-dialog-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'In progress...' : 'Add'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles personnalisés pour react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : 'white',
    color: state.isSelected ? 'white' : 'black',
  }),
};

export default AddPlanteDialog;