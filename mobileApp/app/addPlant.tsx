import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/stores/userStore'; // Assurez-vous que cela fonctionne dans votre projet
import { useRouter } from 'expo-router';
import plantesService from '@/services/plantesService';
import { IPlante } from '@/types/plantes';

export default function AddPlanteScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const token = user?.token;
  const service = plantesService(token || ''); // Assurez-vous que le token est bien transmis

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [addressId, setAddressId] = useState('');

  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        console.log(result.assets[0]);
      }
    } else {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie.');
    }
  };

  const handleSave = async () => {
    if (!name || !description || !imageUri || !addressId) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (!token || !user?.id) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter une plante.');
      return;
    }

    // Créer un objet FormData pour l'envoi de l'image
    const formData = new FormData();

    //Créer un objet de type fichier à partir de l'URI
    const localUri = imageUri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename!);
    const type = match ? `image/${match[1]}` : 'image/jpeg'; // Utilisez le type MIME approprié

    const photo = {
      uri: localUri,
      type: type,
      name: filename,
    };

    formData.append('file', photo);

    const newPlante: IPlante = {
      name,
      description,
      user_id: user.id,
      address_id: addressId,
      image : photo,
    };

    formData.append('name', newPlante.name);
    formData.append('description', newPlante.description);
    formData.append('user_id', newPlante.user_id.toString());
    formData.append('address_id', newPlante.address_id);

    try {
      const response = await service.addPlante(formData); // Utiliser le service pour ajouter la plante
      const data = await response.json();
      if (data.success) {
        Alert.alert('Succès', 'Plante ajoutée avec succès !');
        router.push('/'); // Rediriger vers la page principale
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter la plante.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la plante.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom de la plante"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="ID de l'adresse"
        value={addressId}
        onChangeText={setAddressId}
      />
      <Button title="Sélectionner une image" onPress={handleImagePicker} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : null}
      <Button title="Ajouter la plante" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
});
