import React, { useState, useEffect } from 'react';
import PlantesService from '../../services/PlantesService';
import AddressesService from '../../services/AddressesService.ts';
import Select from 'react-select';

const AddPlanteDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [addressId, setAddressId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null);
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

  // Effet pour nettoyer l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // Libérer la mémoire
      }
    };
  }, [previewImage]);

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

  //Adress show
  const addressOptions = addresses.map((address) => ({
    value: address.id, 
    label: `${address.street}, ${address.city}, ${address.country}`,
  }));

  const handleAddressChange = (selectedOption) => {
    setSelectedAddress(selectedOption);
    setAddressId(selectedOption ? selectedOption.value : ''); 
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleCreateAddress = async () => {
    try {
      const createdAddress = await AddressesService().createAddress(newAddress);
      setAddresses([...addresses, createdAddress]);
      setSelectedAddress({ value: createdAddress.id, label: `${createdAddress.street}, ${createdAddress.city}, ${createdAddress.country}` });
      setAddressId(createdAddress.id); 
      setShowAddressForm(false); 
    } catch (error) {
      console.error('Erreur lors de la création de l\'adresse:', error);
      setError('Erreur lors de la création de l\'adresse.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetImage = () => {
      setImage(null);
      setPreviewImage(null);
  }
  const resetAll = () => {
      setName('');
      setDescription('');
      setImage(null);
      setPreviewImage(null);
      setError('');
}
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !addressId) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address_id', addressId);
      formData.append('description', description);
      if (image) formData.append('image', image);

      const newPlante = await PlantesService().addPlante(formData);
      onAddSuccess(newPlante);
      onClose();
      setName('');
      setDescription('');
      setImage(null);
      setPreviewImage(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la plante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div className="dialog-small">
        <h2>Add plant</h2>
        {error && <div className="text-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Plant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-input"
          />
          <div className="button-position">
            <Select
              placeholder="Select adress"
              options={addressOptions}
              value={selectedAddress}
              onChange={handleAddressChange}
              isSearchable
              noOptionsMessage={() => "No address found"}
              styles={customStyles}
            />
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="button-green"
            >
              Create
            </button>
          </div>
          {showAddressForm && (
            <div>
              <input
                type="text"
                name="country"
                placeholder="country"
                value={newAddress.country}
                onChange={handleAddressInputChange}
                className="text-input"
              />
              <input
                type="text"
                name="city"
                placeholder="city"
                value={newAddress.city}
                onChange={handleAddressInputChange}
                className="text-input"
              />
              <input
                type="text"
                name="zip_code"
                placeholder="Post code"
                value={newAddress.zip_code}
                onChange={handleAddressInputChange}
                className="text-input"
              />
              <input
                type="text"
                name="street"
                placeholder="street"
                value={newAddress.street}
                onChange={handleAddressInputChange}
                className="text-input"
              />
              <input
                type="text"
                name="additional_address_details"
                placeholder="Further details"
                value={newAddress.additional_address_details}
                onChange={handleAddressInputChange}
                className="text-input"
              />
              <button
                type="button"
                onClick={handleCreateAddress}
                className="button-blue"
              >
                Create adress
              </button>
            </div>
          )}
          <textarea
            placeholder="Description of the plant"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className="add-plante-dialog-image-preview">
              <img
                src={previewImage}
                alt="Preview"
                className="img-preview"
              />
              <button onClick={resetImage}>delete img</button>
            </div>
          )}
          
          <div className="button-position2">
          {(name || description ||image ||previewImage)&& (
              <button  onClick={resetAll}>
              reset
            </button>
            )}
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