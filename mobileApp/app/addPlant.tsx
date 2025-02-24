import React, { useState } from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Image, Platform} from 'react-native';
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

    // Pour une image en base64
    if (imageUri.startsWith('data:')) {
      // Extraction de la partie base64 (après la virgule)
      const base64Data = imageUri.split(',')[1];
      // Extraction du type MIME
      const mimeType = imageUri.split(';')[0].split(':')[1];

      // Conversion en Blob
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

      // Créer un nom de fichier avec extension
      const fileName = `image_${Date.now()}.${mimeType.split('/')[1]}`;

      // Ajouter le blob comme fichier au FormData
      formData.append('image', blob, fileName);
    } else {
      // Pour une URI de fichier normale (non base64)
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
    // 'user_id' n'est pas nécessaire car vous utilisez auth()->id() côté backend

    try {
      const response = await service.addPlante(formData);

      const data = await response.json();
      Alert.alert('Succès', 'Plante ajoutée avec succès !');
      router.push('/');
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
