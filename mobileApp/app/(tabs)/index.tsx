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
  const token = useUserStore().user?.token;
  console.log(useUserStore().user)
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
      <ScrollView>
        {plantes.map((plante) => (
          <Card
          key={plante.id}
            id={plante.id}
            avatarUrl="https://example.com/avatar.jpg"
            title={plante.name}
            description={plante.description}
            imageUrl={plante.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
