// Importación de React
import React from 'react';

// Componentes esenciales de React Native
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// Hooks de navegación para acceder a los parámetros de la ruta
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types/navigation';

// Librería de animaciones para la entrada suave de elementos
import Animated, { FadeInDown } from 'react-native-reanimated';

// Definición del tipo de ruta que esta pantalla recibe (según la navegación)
type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export default function NASADetailScreen() {
  // Extraemos los parámetros desde la ruta actual
  const { params } = useRoute<DetailRouteProp>();
  const { imageUrl, title, description } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título con animación de entrada */}
      <Animated.Text entering={FadeInDown.duration(400)} style={styles.title}>
        {title}
      </Animated.Text>

      {/* Imagen con animación retardada */}
      <Animated.Image
        entering={FadeInDown.delay(200).duration(400)}
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Descripción con animación más tardía */}
      <Animated.Text
        entering={FadeInDown.delay(400).duration(500)}
        style={styles.description}
      >
        {description}
      </Animated.Text>
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  image: {
    width: '100%',        // Ancho completo
    height: 400,          // Altura fija
    marginVertical: 20,   // Separación vertical
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',  // Centra el texto del título
  },
  description: {
    fontSize: 16,
    textAlign: 'justify', // Alineación justificada para la descripción
  },
});
