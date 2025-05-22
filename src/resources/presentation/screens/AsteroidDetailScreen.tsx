import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types/navigation';
import Animated, { FadeInDown } from 'react-native-reanimated';

type AsteroidDetailRouteProp = RouteProp<RootStackParamList, 'AsteroidDetail'>;

export default function AsteroidDetailScreen() {
  const route = useRoute<AsteroidDetailRouteProp>();
  const { asteroid } = route.params;

  if (!asteroid) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No se encontraron datos del asteroide</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.card}>
        <Text style={styles.title}>{asteroid.name}</Text>

        {[
          `ID: ${asteroid.id}`,
          `Magnitud absoluta: ${asteroid.absolute_magnitude_h}`,
          `Peligroso: ${asteroid.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}`,
          `Diámetro estimado (km): ${asteroid.estimated_diameter_km_min.toFixed(3)} - ${asteroid.estimated_diameter_km_max.toFixed(3)}`,
          `Velocidad (km/h): ${parseFloat(asteroid.velocity_kmh).toFixed(0)}`,
          `Distancia de paso (km): ${parseFloat(asteroid.miss_distance_km).toFixed(0)}`,
          `Fecha de aproximación: ${asteroid.close_approach_date}`,
        ].map((text, index) => (
          <Animated.Text
            key={index}
            entering={FadeInDown.delay(200 + index * 100).springify()}
            style={styles.detail}
          >
            {text}
          </Animated.Text>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#eaeaea',
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 8 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
