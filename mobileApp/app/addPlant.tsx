import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/stores/userStore'; // Assurez-vous que cela fonctionne dans votre projet
import { useRouter } from 'expo-router';
import plantesService from '@/services/plantesService';
import reservationService from '@/services/reservationService';
import { IPlante } from '@/types/plantes';
import ReservationService from '@/services/reservationService';

export default function AddPlanteScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const token = user?.token;
  const service = plantesService(token || ''); // Assurez-vous que le token est bien transmis
  const reservationService = ReservationService();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [addressId, setAddressId] = useState(1);

  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
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

    if (imageUri.startsWith('data:')) {
      const base64Data = imageUri.split(',')[1];
      const mimeType = imageUri.split(';')[0].split(':')[1];

      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);

        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });

      const fileName = `image_${Date.now()}.${mimeType.split('/')[1]}`;

      formData.append('image', blob, fileName);
    } else {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        type: type,
        name: filename || 'photo.jpg',
      });
    }

    formData.append('name', name);
    formData.append('description', description);
    formData.append('address_id', addressId);

    try {
      const response = await service.addPlante(formData);
      const plantes = await service.getPlantesByUserId(user.id);
      const responseReservation = await reservationService.addReservation({
        plante_id: plantes[plantes.length-1].id,
        owner_user_id: user.id,
        start_date: new Date(),
        end_date: new Date(),
    }, token);

      const data = await response.json();
      Alert.alert('Succès', 'Plante ajoutée avec succès !');
      router.push('/');
    } catch (error) {
      // console.error('Erreur lors de l\'ajout de la plante:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la plante.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
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
      
      <Button title="Select an image" onPress={handleImagePicker} color="#4C9C6F"/>
      <View style={styles.saveButton}></View>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : null}
      <Button title="Add Plant" onPress={handleSave} color="#4C9C6F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F6F4', // Gris doux pour l'arrière-plan de la page
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4C9C6F', // Vert forêt pour le titre
  },
  input: {
    height: 50,
    borderColor: '#A8D08D', // Vert doux pour les bordures
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff', // Fond blanc pour l'input
  },
  saveButton: {
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff', // Texte blanc pour contraster avec le fond vert
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10, // Pour rendre l'image arrondie
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A8D08D', // Bordure verte douce autour de l'image
    elevation: 4, // Ombre pour l'effet de profondeur
    shadowColor: '#A8D08D',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});


