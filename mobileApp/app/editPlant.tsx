import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function EditCardScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = () => {
    // Logique pour sauvegarder ou mettre à jour la carte
    console.log({ title, description, avatarUrl, imageUrl });
    alert('Carte mise à jour !');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="URL Avatar"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="URL Image"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Button title="Sauvegarder" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
