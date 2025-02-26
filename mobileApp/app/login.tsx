import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import userService from '../services/userService';

const { width } = Dimensions.get('window');
const modalWidth = Math.min(400, width * 0.9);

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
        image:"https://i.ytimg.com/vi/P0EvZl8KvaE/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGEUgWihlMA8=&rs=AOn4CLDEE4iluX-R8mt0njywABDdPaQOVQ",
      });
      router.replace('/');
    } catch (err) {
      console.log(err);
      setError("Aucun utilisateur trouvé");
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>A'rosa-je</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email :</Text>
              <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password :</Text>
              <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
              />
            </View>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => router.push('/inscription')}>
                <Text style={styles.link}>Don't have account ?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 25,
    width: modalWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  link: {
    color: '#0000FF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  purple: {
    color: '#800080',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;