import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
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

  const handleDelete = async (planteId) => {
    try {
      if (user?.token && user?.id) {
        await plantesService(user.token).deletePlante(planteId)
        const data = await plantesService(user.token).getPlantesByUserId(user.id);
        setPlantes(data);
      }
      
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {plantes.map((plante) => (
          <View key={plante.id} style={styles.cardWithDelete}>
            <Card
              id={plante.id}
              avatarUrl={user.image}
              title={plante.name}
              description={plante.description}
              imageUrl={plante.image}
              isMyPlants={true}
            />
            <Pressable style={styles.deleteButton} onPress={() => handleDelete(plante.id)}>
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

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
  cardWithDelete: {
    marginBottom: 20,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#4CAF50',
    marginVertical: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ddd',
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
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 15,
  },
});
