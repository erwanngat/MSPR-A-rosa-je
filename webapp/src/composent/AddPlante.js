import React, { useState } from 'react';
import PlantesService from '../services/PlantesService.ts'; // Importation du service

const AddPlante = () => {
  // États pour stocker les valeurs du formulaire
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [message, setMessage] = useState(''); // État pour gérer les messages

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    if (!name || !userId || !addressId) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Données de la nouvelle plante à ajouter
    const planteData = {
      name,
      user_id: userId,
      address_id: addressId,
    };

    try {
      // Appel de la méthode addPlante pour ajouter la plante
      const newPlante = await PlantesService().addPlante(planteData);

      // Message de succès après l'ajout
      setMessage('Plante ajoutée avec succès!');
      // Réinitialisation des champs du formulaire
      setName('');
      setUserId('');
      setAddressId('');
    } catch (error) {
      // Message d'erreur en cas de problème
      setMessage('Erreur lors de l\'ajout de la plante. Veuillez réessayer.');
      console.error('Erreur lors de l\'ajout de la plante:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ajouter une nouvelle plante</h2>

      {/* Affichage du message de confirmation ou d'erreur */}
      {message && <div>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de la plante :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>ID Utilisateur :</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>ID Adresse :</label>
          <input
            type="text"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter la plante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlante;