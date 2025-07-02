import React, { useState, useEffect } from 'react';
import PlantesService from '../../services/PlantesService';
import AddressesService from '../../services/AddressesService.ts'; // Importation du service des adresses
import Select from 'react-select'; // Importation de react-select

const EditPlanteDialog = ({ isOpen, onClose, plante, onUpdateSuccess, onDeleteSuccess }) => {
  const [name, setName] = useState(plante ? plante.name : '');
  const [addressId, setAddressId] = useState(plante ? plante.address_id : '');
  const [description, setDescription] = useState(plante ? plante.description : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]); 
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [showAddressForm, setShowAddressForm] = useState(false); 
  const [newAddress, setNewAddress] = useState({
    country: '',
    city: '',
    zip_code: '',
    street: '',
    additional_address_details: '',
  });
  const [image, setImage] = useState(null); // Nouvel état pour l'image

  // Gérer la sélection d'une nouvelle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Récupérer toutes les adresses au chargement du composant
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await AddressesService().getAddresses();
        setAddresses(data);
      } catch (error) {
        // console.error('Erreur lors de la récupération des adresses:', error);
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
      // console.error('Erreur lors de la création de l\'adresse:', error);
      setError('Erreur lors de la création de l\'adresse.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !addressId) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const planteData = {
        name : name,
        address_id: addressId,
        description: description,
      };
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address_id', addressId);
      formData.append('description', description);
      console.log(planteData);
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      // Appel API pour mettre à jour la plante
      const updatedPlante = await PlantesService().updatePlante(plante.id, formData);
  
      // Notifier le parent (MyPlants) que la mise à jour a réussi
      onUpdateSuccess(updatedPlante);
  
      // Fermer la boîte de dialogue
      onClose();
    } catch (err) {
      setError('Erreur lors de la mise à jour de la plante.');
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plante) return;

    setLoading(true);
    setError('');

    try {
      await PlantesService().deletePlante(plante.id);

      onDeleteSuccess(plante.id);
      onClose();
    } catch (err) {
      onDeleteSuccess(plante.id);
      onClose();

      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fermer la boîte de dialogue si l'utilisateur clique sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setName(plante.name);
      setDescription(plante.description);
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.dialog}>
        <h2>Edit plant</h2>
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
              Create
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
                Create adress
              </button>
            </div>
          )}
          <textarea
            placeholder="Plant description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <input
              type="file"
              accept="image/*" // Accepter uniquement les fichiers image
              onChange={handleImageChange}
              style={styles.input}
            />
          <div style={styles.buttons}>
            <button type="submit" disabled={loading} className='btn'>
              {loading ? 'Loading...' : 'Update'}
            </button>
            <button type="button" onClick={handleDelete} disabled={loading} className='btn'>
              {loading ? 'Loading...' : 'Delete'}
            </button>
            <button type="button" onClick={onClose} className='btn'>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    width: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontFamily: 'Segoe UI, sans-serif',
    marginRight: '20px', // marge à droite
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.8rem',
    borderRadius: '0.5rem',
    border: '1px solid #c2c2c2',
    background: '#f9fbf7',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.8rem',
    borderRadius: '0.5rem',
    border: '1px solid #c2c2c2',
    background: '#f9fbf7',
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.6rem',
  },
  error: {
    color: '#c0392b',
    marginBottom: '0.8rem',
    fontSize: '0.9rem',
  },
  addressSection: {
    display: 'flex',
    gap: '0.6rem',
    marginBottom: '0.8rem',
  },
  createButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: '1rem',
    border: 'none',
    backgroundColor: '#6b8e23',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background 0.3s',
  },
  addressForm: {
    marginBottom: '0.8rem',
  },
  createAddressButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: '1rem',
    border: 'none',
    backgroundColor: '#8fbc8f',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background 0.3s',
  },
};


// Styles react-select cohérents et modernes
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    marginBottom: '0.8rem',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#6b8e23' : '#c2c2c2',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(107,142,35,0.2)' : 'none',
    background: '#f9fbf7',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#6b8e23' : (state.isFocused ? '#dcedc8' : 'white'),
    color: state.isSelected ? 'white' : 'black',
  }),
};


export default EditPlanteDialog;