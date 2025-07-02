import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import UserService from '../services/userService'; // Assurez-vous que UserService est correctement importé
import { useUserStore } from '@/stores/userStore';

export default function EditProfileScreen() {
  const storedUser = useUserStore.getState().user;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Pré-remplir les champs avec les données actuelles de l'utilisateur
  useEffect(() => {
    if (storedUser) {
      setName(storedUser.name);
      setPhone(storedUser.phone);
      setEmail(storedUser.email);
    }
  }, [storedUser]);

  // Assurez-vous d'utiliser la méthode correcte pour mettre à jour le store
  const handleSave = async () => {
    try {
      const userData = {
        id: storedUser?.id,
        name: name,
        phone: phone,
        email: email,
        password: password,
        token: storedUser?.token,
      };
      useUserStore.getState().setUser({
        id: storedUser?.id,
        name: name,
        email: email,
        password: "data.user.id",
        role: storedUser?.role,
        phone: phone,
        token: storedUser?.token,
        image: "https://i.ytimg.com/vi/P0EvZl8KvaE/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGEUgWihlMA8=&rs=AOn4CLDEE4iluX-R8mt0njywABDdPaQOVQ",
      });
      const success = await UserService().updateUser(userData, storedUser?.token, password, passwordConfirmation);
    } catch (e) {

    }


  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modify Profile</Text>

      {/* Champ de saisie pour le nom */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      {/* Champ de saisie pour l'email */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      {/* Champ de saisie pour le mot de passe */}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {/* Champ de saisie pour la confirmation du mot de passe */}
      <TextInput
        style={styles.input}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirm password"
        secureTextEntry
      />

      {/* Champ de saisie pour le téléphone */}
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />

      {/* Bouton pour sauvegarder les modifications */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F6F4', // Gris doux pour une ambiance nature
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4C9C6F', // Vert forêt pour le titre
  },
  input: {
    height: 45,
    borderColor: '#A8D08D', // Vert doux pour les bordures
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4C9C6F', // Vert forêt pour le bouton
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5, // Ombre pour donner un effet de profondeur
    shadowColor: '#4C9C6F', // Ombre de couleur verte pour l'effet naturel
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonText: {
    color: '#fff', // Texte blanc pour contraster avec le fond vert
    fontSize: 18,
    fontWeight: 'bold',
  },
});
