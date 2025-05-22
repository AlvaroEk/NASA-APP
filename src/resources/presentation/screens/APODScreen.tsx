// Importaciones necesarias de React y React Native
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';

// ViewModel personalizado que gestiona el estado de las imágenes APOD
import { useApodListViewModel } from '../viewmodels/useApodViewModel';

// Modelo de datos de la entidad APOD (Astronomy Picture of the Day)
import { Apod } from '../../domain/models/Apod';

// Reanimated para animaciones suaves
import Animated, {
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function ApodViewer() {
  // Hook personalizado que expone el estado, error y método de recarga
  const { apods, loading, error, fromCache, loadApods } = useApodListViewModel();

  // Valor compartido para animar el botón de "Cargar más"
  const scale = useSharedValue(1);

  // Estilo animado del botón que responde a la presión táctil
  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner si los datos están siendo cargados desde caché (modo offline) */}
      {fromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheText}>📡 Mostrando datos en modo offline</Text>
        </View>
      )}

      {/* Renderizado dinámico de las imágenes APOD obtenidas */}
      {apods.map((item: Apod, index: number) => (
        <Animated.View
          key={index}
          entering={ZoomIn.duration(500).delay(index * 100)} // Animación de entrada con retraso
          style={styles.card}
        >
          <Text style={styles.title}>{item.title}</Text>

          {/* Si el tipo es imagen, renderiza imagen, si no, muestra URL de video */}
          {item.media_type === 'image' ? (
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
          ) : (
            <Text style={styles.description}>Video: {item.url}</Text>
          )}

          <Text style={styles.description}>{item.explanation}</Text>
        </Animated.View>
      ))}

      {/* Indicador de carga o botón animado para obtener más resultados */}
      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : (
        <Pressable
          onPressIn={() => (scale.value = withSpring(0.8, { damping: 5 }))} // Animación al presionar
          onPressOut={() => {
            scale.value = withSpring(1.2, { damping: 4 }); // Rebote
            setTimeout(() => {
              scale.value = withSpring(1); // Regreso a estado original
              loadApods(); // Llama al ViewModel para cargar más datos
            }, 100);
          }}
        >
          <Animated.View style={[styles.button, animatedButton]}>
            <Text style={styles.buttonText}>Cargar más</Text>
          </Animated.View>
        </Pressable>
      )}

      {/* Muestra el error si ocurrió */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' }, // Contenedor general
  card: { marginBottom: 30, width: '100%' }, // Cada tarjeta APOD
  image: { width: '100%', height: 300, marginVertical: 10 }, // Imagen
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }, // Título
  description: { fontSize: 16, marginTop: 5, textAlign: 'justify' }, // Texto explicativo
  errorText: { color: 'red', fontSize: 18 }, // Errores
  button: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' }, // Texto del botón
  cacheBanner: {
    backgroundColor: '#ffd700',
    padding: 8,
    borderRadius: 5,
    marginBottom: 12,
  },
  cacheText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
