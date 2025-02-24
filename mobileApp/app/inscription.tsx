import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IUser } from '../types/user';
import UserService from '../services/userService';

const { width } = Dimensions.get('window');
const modalWidth = Math.min(400, width * 0.9);

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
            id: '',
            name,
            email,
            phone,
            password,
            token: '',
        };

        try {
            const verif: boolean = await UserService().register(user, confirmPassword);
            if(verif) {
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
            <View style={styles.contentWrapper}>
                <Text style={styles.title}>A'rosa-je</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name :</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

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
                        <Text style={styles.label}>Phone number :</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password :</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.link}>Have an account ?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
                        <Text style={styles.signupText}>SIGN UP</Text>
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
        marginVertical: 15,
    },
    link: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color: '#0000FF',
    },
    signupButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    signupText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;