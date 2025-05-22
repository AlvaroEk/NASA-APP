import React, { useEffect, useState } from 'react'; // Hooks de React
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native'; // Componentes de UI nativos

import axios from 'axios'; // Cliente HTTP para llamadas a la API
import Animated, { ZoomInDown } from 'react-native-reanimated'; // Animaciones

import { NASA_API_KEY } from '@env'; // Importación de la API KEY desde archivo .env

// Definimos el tipo de datos que devuelve la API EPIC
interface EpicItem {
  image: string;
  date: string;
  caption: string;
}

export default function EpicViewer() {
  // Estado para almacenar los datos obtenidos de la API
  const [epicData, setEpicData] = useState<EpicItem[]>([]);
  const [loading, setLoading] = useState(true); // Carga inicial
  const [error, setError] = useState<string | null>(null); // Manejo de errores

  // Se ejecuta al montar el componente
  useEffect(() => {
    const fetchEPIC = async () => {
      // URL para obtener imágenes naturales de EPIC
      const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;

      try {
        // Llamada a la API
        const response = await axios.get(url);
        const items = response.data.slice(0, 5); // Solo 5 imágenes
        setEpicData(items); // Actualizamos estado
      } catch (err: any) {
        // Manejamos diferentes tipos de errores
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
        setLoading(false); // Finaliza la carga
      }
    };

    fetchEPIC(); // Ejecutamos la función
  }, []);

  // Calcula la URL de la imagen con base en la fecha
  const getImageUrl = (item: EpicItem) => {
    const [date] = item.date.split(' ');
    const [year, month, day] = date.split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`;
  };

  // Determina si la imagen es de día (entre 06:00 y 18:00 UTC)
  const isDaytime = (dateString: string) => {
    const hour = new Date(dateString).getUTCHours();
    return hour >= 6 && hour < 18;
  };

  // Vista de carga
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008000" />
        <Text>Loading Earth images...</Text>
      </View>
    );
  }

  // Vista de error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Vista principal: lista de imágenes con animación y cambio de tema
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {epicData.map((item, index) => {
        const day = isDaytime(item.date); // Determinamos si es de día o de noche
        return (
          <Animated.View
            key={index}
            entering={ZoomInDown.delay(index * 100).duration(500)} // Animación
            style={[styles.card, day ? styles.dayCard : styles.nightCard]} // Estilo dinámico
          >
            <Text style={[styles.title, day ? styles.dayText : styles.nightText]}>
              📅 {item.date}
            </Text>
            <Image
              source={{ uri: getImageUrl(item) }} // Imagen desde la NASA
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={[styles.description, day ? styles.dayText : styles.nightText]}>
              {item.caption}
            </Text>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

// Estilos de los componentes
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
    borderRadius: 10,
    padding: 15,
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
  dayCard: {
    backgroundColor: '#e6f7ff',
  },
  nightCard: {
    backgroundColor: '#1c1c3c',
  },
  dayText: {
    color: '#000',
  },
  nightText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
