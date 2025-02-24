import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import userService from '../services/userService'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useUserStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    try {
      const data = await userService().login(email, password);
      console.log(data);
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        password: "data.user.id",
        role: data.user.roles[0].name,
        phone:data.user.phone_number,
        token: data.token,
      });
      router.replace('/');
    } catch (err) {
      console.log(err);
      setError("Aucun utilisteur trouvé");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Se connecter" onPress={handleLogin} />

      {/* Lien vers l'inscription */}
      <Pressable onPress={() => router.push('/inscription')}>
        <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
    fontSize: 16,
  },
});

export default LoginScreen;