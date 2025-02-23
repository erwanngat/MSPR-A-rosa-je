import { StyleSheet, ScrollView, Pressable } from 'react-native';
import Card from '../../components/Card';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';  // Pour la navigation
import { useUserStore } from '@/stores/userStore';

export default function MyPlantsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Card
          avatarUrl="https://example.com/avatar.jpg"
          title="Card Title"
          description="This is a description of the card."
          imageUrl="https://example.com/image.jpg"
        />
        {/* Ajoute d'autres cartes ici */}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    paddingBottom: 60,  // Pour que le bouton ne soit pas couvert par la ScrollView
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 30,  // Positionne le bouton à 30px du bas
    right: 20,   // Positionne le bouton à 20px du bord droit
    backgroundColor: '#007BFF',
    borderRadius: 50, // Pour avoir un bouton rond
    padding: 15,
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
});
