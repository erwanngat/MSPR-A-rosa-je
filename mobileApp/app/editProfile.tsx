import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';

export default function EditProfileScreen() {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('+123 456 789');
  const [email, setEmail] = useState('johndoe@example.com');

  const handleSave = () => {
    console.log('Profil mis à jour:', { name, phone, email });
    alert('Profil mis à jour avec succès !');
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

      {/* Champ de saisie pour le téléphone */}
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Téléphone"
        keyboardType="phone-pad"
      />

      {/* Champ de saisie pour l'email */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
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
