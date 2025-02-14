import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { Link } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations détaillées</Text>

      {/* Description détaillée de l'objet de la modal */}
      <Text style={styles.description}>
        Cette page vous fournit des informations détaillées sur les fonctionnalités disponibles 
        dans l'application. Vous pouvez voir vos informations personnelles, modifier vos préférences 
        et gérer d'autres paramètres pertinents à votre profil. Cette page sert aussi à fournir des 
        explications sur l'utilisation de certaines options de l'application.
      </Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Autre texte pour plus d'information */}
      <Text style={styles.text}>
        Cette fenêtre modale est utilisée pour afficher des informations complémentaires et des actions 
        que vous pouvez prendre concernant votre compte ou d'autres sections de l'application.
      </Text>

      {/* Lien de retour à la page précédente (par exemple à partir de l'écran principal) */}
      <Link href="/" style={styles.link}>
        <Button title="Retour à l'accueil" />
      </Link>

      {/* Utilisation du StatusBar pour adapter le style en fonction de la plateforme */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
  },
});
