import { StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import { View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/userStore';

export default function TabOneScreen() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated, isReady, router]);

  if (isAuthenticated === false || !isReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card
          avatarUrl="https://example.com/avatar.jpg"
          title="Card Title"
          description="This is a description of the card."
          imageUrl="https://example.com/image.jpg"
        />
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
