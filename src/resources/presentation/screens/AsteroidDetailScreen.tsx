import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types/navigation';

type AsteroidDetailRouteProp = RouteProp<RootStackParamList, 'AsteroidDetail'>;

const AsteroidDetailScreen: React.FC = () => {
  const { params } = useRoute<AsteroidDetailRouteProp>();
  const { asteroid } = params;

  const closeApproach = asteroid.close_approach_data[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{asteroid.name}</Text>
      <Text>Magnitud absoluta: {asteroid.absolute_magnitude_h}</Text>
      <Text>
        ¿Peligroso?: {asteroid.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}
      </Text>
      <Text>
        Diámetro estimado (km):{' '}
        {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} -{' '}
        {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}
      </Text>
      <Text>
        Velocidad relativa (km/h):{' '}
        {parseFloat(closeApproach.relative_velocity.kilometers_per_hour).toFixed(2)}
      </Text>
      <Text>
        Distancia mínima a la Tierra (km):{' '}
        {parseFloat(closeApproach.miss_distance.kilometers).toFixed(2)}
      </Text>
      <Text>Fecha de aproximación: {closeApproach.close_approach_date}</Text>
    </ScrollView>
  );
};

export default AsteroidDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
