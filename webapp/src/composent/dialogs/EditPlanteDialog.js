import React, { useState, useEffect } from 'react';
import PlantesService from '../../services/PlantesService.ts';
import AddressesService from '../../services/AddressesService.ts'; // Importation du service des adresses
import Select from 'react-select'; // Importation de react-select

const EditPlanteDialog = ({ isOpen, onClose, plante, onUpdateSuccess, onDeleteSuccess }) => {
  const [name, setName] = useState(plante ? plante.name : '');
  const [addressId, setAddressId] = useState(plante ? plante.address_id : '');
  const [description, setDescription] = useState(plante ? plante.description : '');
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

  // Mettre à jour les champs lorsque la plante change
  useEffect(() => {
    if (plante) {
      setName(plante.name);
      setAddressId(plante.address_id);
      setDescription(plante.description);

      // Sélectionner l'adresse actuelle dans le dropdown
      const currentAddress = addresses.find((addr) => addr.id === plante.address_id);
      if (currentAddress) {
        setSelectedAddress({
          value: currentAddress.id,
          label: `${currentAddress.street}, ${currentAddress.city}, ${currentAddress.country}`,
        });
      }
    }
  }, [plante, addresses]);

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

  // Gérer la soumission du formulaire de mise à jour de la plante
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !addressId) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API pour mettre à jour la plante
      const updatedPlante = await PlantesService().updatePlante(plante.id, {
        name,
        address_id: addressId,
        description,
      });

      // Notifier le parent (MyPlants) que la mise à jour a réussi
      onUpdateSuccess(updatedPlante);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer la suppression de la plante
  const handleDelete = async () => {
    if (!plante) return;

    setLoading(true);
    setError('');

    try {
      // Appel API pour supprimer la plante
      await PlantesService().deletePlante(plante.id);

      // Notifier le parent (MyPlants) que la suppression a réussi
      onDeleteSuccess(plante.id);

      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de la suppression de la plante.');
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
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.dialog}>
        <h2>Modifier la plante</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom de la plante"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <div style={styles.addressSection}>
            <Select
              placeholder="Sélectionner une adresse"
              options={addressOptions}
              value={selectedAddress}
              onChange={handleAddressChange}
              isSearchable // Activer la recherche
              noOptionsMessage={() => "Aucune adresse trouvée"} // Message si aucune option
              styles={customStyles} // Styles personnalisés
            />
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={styles.createButton}
            >
              Créer
            </button>
          </div>
          {/* Formulaire de création d'adresse */}
          {showAddressForm && (
            <div style={styles.addressForm}>
              <input
                type="text"
                name="country"
                placeholder="Pays"
                value={newAddress.country}
                onChange={handleAddressInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="city"
                placeholder="Ville"
                value={newAddress.city}
                onChange={handleAddressInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="zip_code"
                placeholder="Code postal"
                value={newAddress.zip_code}
                onChange={handleAddressInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="street"
                placeholder="Rue"
                value={newAddress.street}
                onChange={handleAddressInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="additional_address_details"
                placeholder="Détails supplémentaires"
                value={newAddress.additional_address_details}
                onChange={handleAddressInputChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleCreateAddress}
                style={styles.createAddressButton}
              >
                Créer l'adresse
              </button>
            </div>
          )}
          <textarea
            placeholder="Description de la plante"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <div style={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? 'En cours...' : 'Modifier'}
            </button>
            <button type="button" onClick={handleDelete} disabled={loading}>
              {loading ? 'En cours...' : 'Supprimer'}
            </button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles CSS en ligne
const styles = {
  overlay: {
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
    borderRadius: '8px',
    width: '400px', // Ajustez la largeur si nécessaire
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  addressSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  createButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  addressForm: {
    marginBottom: '10px',
  },
  createAddressButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
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

export default EditPlanteDialog;