import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface CardProps {
  avatarUrl: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ avatarUrl, title, description, imageUrl }) => {
  const router = useRouter();

  const handlePress = () => {
    // Redirige vers la page modal lorsque la carte est pressée
    router.push('/modal'); // Assure-toi que l'écran modal est correctement configuré dans expo-router
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.leftSide}>
          {/* Avatar */}
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        <View style={styles.rightSide}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          {/* Description */}
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Image on the right */}
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSide: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rightSide: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default Card;
