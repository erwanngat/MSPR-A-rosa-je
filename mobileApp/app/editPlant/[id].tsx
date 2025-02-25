import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/stores/userStore'; // Assurez-vous que cela fonctionne dans votre projet
import plantesService from '@/services/plantesService';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { IPlante } from '@/types/plantes';

export default function EditPlanteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const token = user?.token;
  const service = plantesService(token || ''); // Assurez-vous que le token est bien transmis

  // États locaux pour la plante et l'état de chargement
  const [planteToUpdate, setPlanteToUpdate] = useState<IPlante | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [addressId, setAddressId] = useState('');
  const [idPlante, setIdPlante] = useState(1);

  useEffect(() => {
    const fetchPlante = async () => {
      try {
        const planteData = await service.getPlantesById(id);
        setIdPlante(planteData.id)
        setPlanteToUpdate(planteData);
        setName(planteData.name);
        setDescription(planteData.description);
        setImageUri(planteData.image);
        setAddressId(planteData.address_id);
      } catch (error) {
        console.error('Erreur lors de la récupération de la plante:', error);
        Alert.alert('Erreur', 'Impossible de récupérer la plante.');
      }
    };

    fetchPlante();
  }, [id]);

  const handleImagePicker = async () => {
    console.log(imageUri);
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
    if (!name || !description || !addressId) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
  
    if (!token || !user?.id) {
      Alert.alert('Erreur', 'Vous devez être connecté pour modifier une plante.');
      return;
    }
  
    const formData = new FormData();
    
    // Ajoutez d'abord les champs texte pour vous assurer qu'ils sont bien inclus
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address_id', addressId);
  
    // Gestion de l'image
    if (imageUri) {
      // Si l'image a été modifiée et n'est pas une URL du serveur
      if (!imageUri.startsWith('http')) {
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
  
        // Créer l'objet de fichier pour React Native
        const imageObject = {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          type: type,
          name: filename,
        };
  
        // Ajoutez l'image au FormData
        formData.append('image', imageObject);
      } else {
        // Si c'est une URL existante, vous pouvez soit:
        // 1. Ne rien faire si votre API est configurée pour garder l'image existante
        // 2. Envoyer l'URL de l'image existante
        formData.append('image_url', imageUri);
      }
    }
  
    try {
      console.log('Envoi des données...');
      // Utilisez la nouvelle version du service
      const response = await service.updatePlante(idPlante, formData);
  
      if (!response.ok) {
        // Analysez l'erreur si c'est du JSON
        try {
          const errorData = JSON.parse(response.text);
          console.error('Erreur détaillée:', errorData);
          
          // Affichez les messages d'erreur spécifiques si disponibles
          if (errorData.name || errorData.description) {
            const errorMessages = [
              ...(errorData.name ? errorData.name : []),
              ...(errorData.description ? errorData.description : [])
            ].join('\n');
            
            Alert.alert('Validation échouée', errorMessages);
          } else {
            Alert.alert('Erreur', 'Validation échouée. Vérifiez les données saisies.');
          }
        } catch (e) {
          // Si ce n'est pas du JSON
          Alert.alert('Erreur', `Erreur du serveur: ${response.text}`);
        }
        return;
      }
  
      Alert.alert('Succès', 'Plante mise à jour avec succès !');
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la plante:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la plante.');
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
