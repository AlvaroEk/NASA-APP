import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Animated, { ZoomInDown } from 'react-native-reanimated';

interface EpicItem {
  image: string;
  date: string;
  caption: string;
}

// 🔑 Usa tu clave real aquí
const NASA_API_KEY = 'VgeyJVV0egimWCRldYQYex5Ms1XjeATAc4YV9Rgs'; 

export default function EpicViewer() {
  const [epicData, setEpicData] = useState<EpicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEPIC = async () => {
      const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;

      try {
        const response = await axios.get(url);
        const items = response.data.slice(0, 5);
        setEpicData(items);
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 429) {
            setError('Límite de solicitudes excedido. Intenta más tarde.');
          } else {
            setError(`Error del servidor: ${err.response.status}`);
          }
        } else if (err.request) {
          setError('No se recibió respuesta del servidor.');
        } else {
          setError('Error desconocido al obtener los datos.');
        }
        console.error('EPIC error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEPIC();
  }, []);

  const getImageUrl = (item: EpicItem) => {
    const [date] = item.date.split(' ');
    const [year, month, day] = date.split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text>Loading Earth images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {epicData.map((item, index) => (
        <Animated.View
          key={index}
          entering={ZoomInDown.delay(index * 100).duration(500)}
          style={styles.card}
        >
          <Text style={styles.title}>📅 {item.date}</Text>
          <Image
            source={{ uri: getImageUrl(item) }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.description}>{item.caption}</Text>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 30,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'justify',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
