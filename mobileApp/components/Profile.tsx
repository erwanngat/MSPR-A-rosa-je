import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';

export const Profile = ({ profile, edit }: { profile: { name: string, phone: string, email: string, avatarUrl: string }, edit: boolean }) => {
  return (
    <View style={styles.container}>
      {/* Décoration supérieure - feuilles stylisées */}
      <View style={styles.decorationTop}>
        <View style={styles.leaf1} />
        <View style={styles.leaf2} />
      </View>
      
      {/* Avatar avec bordure végétale */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
      </View>
      
      {/* Nom et bouton d'édition */}
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{profile.name}</Text>
        
        {edit && (
          <Link href="/editProfile">
            <Pressable style={styles.editIcon}>
              <FontAwesome name="pencil" size={20} color="#4a7c59" />
            </Pressable>
          </Link>
        )}
      </View>

      {/* Conteneur des informations de contact */}
      <View style={styles.infoCard}>
        {/* Informations de contact */}
        <View style={styles.contactContainer}>
          <View style={styles.contactIconContainer}>
            <FontAwesome name="phone" size={14} color="#4a7c59" />
          </View>
          <Text style={styles.contactLabel}>Phone :</Text>
          <Text style={styles.contactValue}>{profile.phone}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.contactContainer}>
          <View style={styles.contactIconContainer}>
            <FontAwesome name="envelope" size={14} color="#4a7c59" />
          </View>
          <Text style={styles.contactLabel}>Email :</Text>
          <Text style={styles.contactValue}>{profile.email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    // Container principal avec un fond légèrement texturé
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fbf7', // Fond très légèrement verdâtre
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      position: 'relative',
      overflow: 'hidden', // Pour masquer les décorations qui dépassent
    },
    
    // Éléments décoratifs
    decorationTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      overflow: 'hidden',
    },
    leaf1: {
      position: 'absolute',
      top: -20,
      right: -20,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(74, 124, 89, 0.15)', // Vert transparent
      transform: [{ rotate: '45deg' }],
    },
    leaf2: {
      position: 'absolute',
      top: -40,
      left: -20,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(115, 169, 105, 0.1)', // Vert clair transparent
      transform: [{ rotate: '25deg' }],
    },
    
    // Avatar amélioré
    avatarWrapper: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      // Bordure stylisée comme du feuillage
      borderWidth: 4,
      borderColor: '#a8d5ba', // Vert clair
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    
    // Conteneur pour le nom
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    name: {
      fontSize: 28,
      fontWeight: '600',
      color: '#3c5a45', // Vert forêt
      textShadowColor: 'rgba(0, 0, 0, 0.05)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    editIcon: {
      marginLeft: 12,
      padding: 6,
      backgroundColor: 'rgba(168, 213, 186, 0.3)', // Vert très clair
      borderRadius: 12,
    },
    
    // Carte pour les informations
    infoCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      width: '100%',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    
    // Style pour chaque ligne d'information
    contactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      width: '100%',
    },
    contactIconContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'rgba(168, 213, 186, 0.3)', // Vert très clair
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    contactLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#5a7d69', // Vert moyen
      flex: 0.4,
    },
    contactValue: {
      fontSize: 16,
      fontWeight: '400',
      color: '#2c3e50', // Bleu foncé
      flex: 0.6,
    },
    
    // Séparateur
    divider: {
      height: 1,
      backgroundColor: '#e0e9e4', // Vert très clair
      width: '100%',
      marginVertical: 2,
    },
    
    // Ce style est conservé du code original pour la compatibilité
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f7f7f7',
    },
});