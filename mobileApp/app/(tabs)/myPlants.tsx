import { useState, useEffect } from 'react';  // Import de useState et useEffect
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import Card from '../../components/Card';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import plantesService from '@/services/plantesService';

export default function MyPlantsScreen() {
  const user = useUserStore().user;
  const [plantes, setPlantes] = useState([]);

  useEffect(() => {
    const fetchPlantes = async () => {
      if (user?.token && user?.id) {
        const data = await plantesService(user.token).getPlantesByUserId(user.id);
        setPlantes(data);
      }
    };

    fetchPlantes();
  }, [user]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {plantes.map((plante) => (
          <Card
            key={plante.id}
            id={plante.id}
            avatarUrl={user.image}
            title={plante.name}
            description={plante.description}
            imageUrl={plante.image}
            isMyPlants={true}
          />
        ))}
      </ScrollView>

      {/* Bouton + en bas pour éditer la carte */}
      <Link href="/addPlant" style={styles.editButtonContainer}>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>+</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f4', 
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  editButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',  // Vert nature
    marginVertical: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ddd',  // Légère séparation grise
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 30,  // Positionne le bouton à 30px du bas
    right: 20,   // Positionne le bouton à 20px du bord droit
    backgroundColor: '#007BFF',
    borderRadius: 50, // Pour avoir un bouton rond
    padding: 15,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
});
