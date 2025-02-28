import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface CardProps {
  id: number;
  avatarUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  isMyPlants: boolean;
}

const Card: React.FC<CardProps> = ({ id, avatarUrl, title, description, imageUrl, isMyPlants }) => {
  const router = useRouter();

  const handlePress = () => {
    if (isMyPlants) router.push(`/editPlant/${id}`);
    else router.push(`/modal/${id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.leftSide}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        <View style={styles.rightSide}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  leftSide: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  rightSide: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    lineHeight: 20,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
});

export default Card;
