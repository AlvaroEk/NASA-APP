// Importación de React
import React from 'react';

// Componentes nativos de React Native
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';

// Hook personalizado para manejar el estado de la búsqueda de software
import { useTechViewModel } from '../viewmodels/useTechViewModel';

// Animaciones de entrada y estilo dinámico de botones
import Animated, {
  ZoomIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function TechTransferScreen() {
  // Destructuramos valores del ViewModel
  const {
    results, loading, error,
    fromCache,   // si los datos vienen de almacenamiento local
    query, setQuery, // texto de búsqueda
    search, // función para buscar
  } = useTechViewModel();

  // Valor compartido para animar escala del botón
  const scale = useSharedValue(1);

  // Estilo animado para hacer zoom in/out en el botón al presionarlo
  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NASA TechTransfer - Software</Text>

      {/* Input para escribir el término de búsqueda */}
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar software..."
        onSubmitEditing={search} // permite buscar con la tecla enter
      />

      {/* Botón animado para ejecutar búsqueda */}
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.8, { damping: 5 }))} // animación al presionar
        onPressOut={() => {
          scale.value = withSpring(1.2, { damping: 4 });
          setTimeout(() => {
            scale.value = withSpring(1); // vuelve a su tamaño original
            search(); // ejecuta la búsqueda
          }, 100);
        }}
      >
        <Animated.View style={[styles.button, animatedButton]}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Animated.View>
      </Pressable>

      {/* Banner si se está usando información desde caché */}
      {fromCache && (
        <Animated.View entering={FadeInDown.springify()} style={styles.cacheBanner}>
          <Text style={styles.cacheText}>📡 Mostrando datos en modo offline</Text>
        </Animated.View>
      )}

      {/* Estado de carga, error o lista de resultados */}
      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={results} // resultados de búsqueda
          keyExtractor={(item, index) => item.id + index} // clave única
          renderItem={({ item, index }) => (
            <Animated.View
              entering={ZoomIn.duration(500).delay(index * 100)} // animación escalonada
              style={styles.card}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text numberOfLines={3}>{item.description}</Text>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8 },
  button: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 10,
  },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
  cacheBanner: {
    backgroundColor: '#ffd700',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  cacheText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
