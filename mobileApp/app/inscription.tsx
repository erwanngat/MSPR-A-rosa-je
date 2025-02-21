import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Picker, Alert, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [phone, setPhone] = useState('');

  const router = useRouter();

  const handleSignup = () => {
    if (!name || !username || !password || !email || !phone) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    console.log({ name, username, password, email, role, phone });
    Alert.alert('Succès', 'Inscription réussie !');
    
    router.push('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Rôle</Text>
      <Picker selectedValue={role} style={styles.picker} onValueChange={setRole}>
        <Picker.Item label="Utilisateur" value="user" />
        <Picker.Item label="Administrateur" value="admin" />
      </Picker>

      <Button title="S'inscrire" onPress={handleSignup} />

      {/* Lien vers la connexion */}
      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
    fontSize: 16,
  },
});
