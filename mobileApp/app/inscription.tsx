import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { IUser } from '../types/user';
import UserService from '../services/userService';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStore';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); 
  
  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    const user: IUser = {
      name,
      email,
      phone,
      password,
      token: '',
    };

    // Appel au service d'inscription
    try {
      const verif: boolean = await UserService().register(user, confirmPassword);
      if(verif){
        router.push('/login');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription.');
      }
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Inscription</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <Button title="S'inscrire" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default RegisterScreen;
