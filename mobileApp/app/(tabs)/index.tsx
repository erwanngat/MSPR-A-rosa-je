import { StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStore';
import plantesService from '@/services/plantesService';

export default function TabOneScreen() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);
  const [plantes, setPlantes] = useState([]);
  const user = useUserStore().user;
  const token = useUserStore().user?.token;

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    const fetchPlantes = async () => {
      try {
        const data = await plantesService(token).getPlantes();
        setPlantes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes:', error);
      }
    };

    if (isAuthenticated) {
      fetchPlantes();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === false || !isReady) {
    return null;
  }

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
            isMyPlants={false}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f4',  // Couleur de fond clair, légèrement verte
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 20,
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
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
});
