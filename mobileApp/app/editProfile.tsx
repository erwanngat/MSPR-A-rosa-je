import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import UserService from '../services/userService'; // Assurez-vous que UserService est correctement importé
import { useUserStore } from '@/stores/userStore';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSave = async () => {
    const storedUser = useUserStore.getState().user;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    const userData = {
      id: storedUser?.id,
      name: name,
      phone: phone,
      email: email,
      password: password,
      token: storedUser?.token,
    };

    // Appel à la fonction updateUser pour mettre à jour l'utilisateur avec le token
    const success = await UserService().updateUser(userData, storedUser?.token, password, passwordConfirmation);
    console.log(success);

    // if (success) {
    //   Alert.alert('Succès', 'Profil mis à jour avec succès !');
    // } else {
    //   Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
    // }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le Profil</Text>

      {/* Champ de saisie pour le nom */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nom"
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
        placeholder="Mot de passe"
        secureTextEntry
      />

      {/* Champ de saisie pour la confirmation du mot de passe */}
      <TextInput
        style={styles.input}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
      />

<TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="phone"
        secureTextEntry
      />

      {/* Bouton pour sauvegarder les modifications */}
      <Button title="Sauvegarder" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
