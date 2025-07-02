import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useUserStore } from '@/stores/userStore';
import { useLocalSearchParams } from 'expo-router';
import UserService from '../../services/userService';
import { Profile } from '@/components/Profile';

export default function ProfileScreen () {
  const { id } = useLocalSearchParams();
  const userStored = useUserStore().user;
  const [profile, setProfile] = useState<any>(null);  // Initialise avec un état vide pour le profil
  const [loading, setLoading] = useState<boolean>(true);  // Pour gérer l'état de chargement

  useEffect(() => {
    // Fonction pour récupérer les données de l'utilisateur
    const fetchUserProfile = async () => {
      if (id && userStored?.token) {
        try {
          // Appel au service pour récupérer les données
          const userProfile = await UserService().getUser(userStored?.token, id);

          // Formatage des données du profil
          setProfile({
            name: userProfile.name,
            phone: userProfile.phone_number,
            email: userProfile.email,
            avatarUrl: userProfile.avatarUrl || 'https://via.placeholder.com/100', // Utilisation d'une image par défaut si aucune image
          });
        } catch (error) {
          // console.error('Erreur lors de la récupération du profil:', error);
        } finally {
          setLoading(false);  // Une fois les données récupérées, on arrête le chargement
        }
      }
    };

    fetchUserProfile();
  }, [id, userStored?.token]);  // Re-lancer la requête si l'id ou le token changent

  // Affichage de l'indicateur de chargement
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <Profile edit={false} profile={profile} />
      ) : (
        <Text>Profil not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  editIcon: {
    marginLeft: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
});
