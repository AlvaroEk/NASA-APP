// Importaciones de React y componentes de React Native
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Importación del ViewModel personalizado para asteroides NEO
import { useNeoViewModel } from '../viewmodels/useNeoViewModel';

// Hook de navegación para navegar a detalle
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types/navigation';

// Reanimated para animaciones de entrada y botones
import Animated, {
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function AsteroidsScreen() {
  // Destructuramos los valores del ViewModel
  const {
    neos, loading, error,
    startDate, endDate,
    setStartDate, setEndDate,
    search,
  } = useNeoViewModel();

  // Animación para el botón
  const scale = useSharedValue(1);

  // Hook de navegación para ir a pantalla de detalle
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estilo animado del botón que cambia al presionar
  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asteroides Cercanos</Text>

      {/* Inputs de búsqueda: fecha de inicio y fin */}
      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Fecha inicio" />
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Fecha fin" />

      {/* Botón animado para ejecutar búsqueda */}
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.8, { damping: 5 }))} // animación al presionar
        onPressOut={() => {
          scale.value = withSpring(1.2, { damping: 4 });
          setTimeout(() => {
            scale.value = withSpring(1); // vuelve a escala normal
            search(); // ejecuta búsqueda desde el ViewModel
          }, 100);
        }}
      >
        <Animated.View style={[styles.button, animatedButton]}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Animated.View>
      </Pressable>

      {/* Mostrar carga, error o resultados */}
      {loading ? (
        <ActivityIndicator size="large" color="#800080" style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={neos} // lista de asteroides
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => navigation.navigate('AsteroidDetail', { asteroid: item })}>
              <Animated.View
                entering={ZoomIn.duration(500).delay(index * 100)} // animación de aparición
                style={styles.card}
              >
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text>Magnitud: {item.absolute_magnitude_h}</Text>
                <Text>Peligroso: {item.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}</Text>
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8 },
  button: {
    backgroundColor: '#800080',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginBottom: 10,
  },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});
