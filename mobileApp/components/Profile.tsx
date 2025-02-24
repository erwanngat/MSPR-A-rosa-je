import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';

export const Profile = ({ profile, edit }: { profile: { name: string, phone: string, email: string, avatarUrl: string }, edit: boolean }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
      
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{profile.name}</Text>
        
        {edit && (
          <Link href="/editProfile">
            <Pressable style={styles.editIcon}>
              <FontAwesome name="pencil" size={20} color="#333" />
            </Pressable>
          </Link>
        )}
      </View>

      {/* Informations de contact */}
      <View style={styles.contactContainer}>
        <Text style={styles.contactLabel}>Téléphone :</Text>
        <Text style={styles.contactValue}>{profile.phone}</Text>
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.contactLabel}>Email :</Text>
        <Text style={styles.contactValue}>{profile.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f7f7f7',
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
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