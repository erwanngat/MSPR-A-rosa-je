import { StyleSheet, ScrollView } from 'react-native';
import Card from '../../components/Card';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
      <Card
        avatarUrl="https://example.com/avatar.jpg"
        title="Card Title"
        description="This is a description of the card."
        imageUrl="https://example.com/image.jpg"
      />
      {/* Ajoute d'autres cartes ici */}
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
