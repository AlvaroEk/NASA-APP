// Importaciones necesarias desde React y React Native
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Dimensions
} from 'react-native';

// Cliente HTTP para llamadas a la API de NASA
import axios from 'axios';

// Hooks y tipos de navegación
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types/navigation';

// Definimos el tipo de cada ítem mostrado en la galería
interface NasaItem {
  title: string;
  description: string;
  imageUrl: string;
}

// Tipo para navegación al detalle
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export default function NASALibraryScreen() {
  // Estados para búsqueda, resultados y control de carga
  const [searchTerm, setSearchTerm] = useState('galaxy'); // Texto del input
  const [query, setQuery] = useState('galaxy');           // Texto usado en la búsqueda
  const [items, setItems] = useState<NasaItem[]>([]);     // Resultados de imágenes
  const [loading, setLoading] = useState(true);           // Indicador de carga
  const [error, setError] = useState<string | null>(null); // Mensaje de error

  const navigation = useNavigation<NavigationProp>();

  // Definición de columnas para la galería
  const numColumns = 2;
  const imageSize = Dimensions.get('window').width / numColumns - 30;

  // Efecto que ejecuta la búsqueda cada vez que cambia "query"
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Consulta a la API pública de la NASA
        const response = await axios.get(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
        );
        const rawItems = response.data.collection.items;

        // Filtramos y parseamos solo los ítems válidos con imágenes
        const parsedItems = rawItems
          .filter((item: any) => item.links?.[0]?.href)
          .map((item: any) => {
            const data = item.data[0];
            return {
              title: data.title,
              description: data.description || 'No description available.',
              imageUrl: item.links[0].href,
            };
          });

        setItems(parsedItems.slice(0, 30)); // Limitamos a 30 elementos
        setError(null);
      } catch (err: any) {
        console.error('NASA LIBRARY error:', err.message);
        setError('Failed to fetch NASA library data.');
      } finally {
        setLoading(false); // Terminamos la carga
      }
    };

    fetchData();
  }, [query]);

  // Función para ejecutar la búsqueda (modifica "query" basado en el input)
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setQuery(searchTerm.trim());
    }
  };

  // Función para renderizar cada imagen de la galería
  const renderItem = ({ item }: { item: NasaItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() =>
        navigation.navigate('Detail', {
          imageUrl: item.imageUrl,
          title: item.title,
          description: item.description,
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={{ width: imageSize, height: imageSize }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Formulario de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search NASA media..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Estados de carga, error o galería */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#800080" />
          <Text>Loading gallery...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gallery}
        />
      )}
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    height: 40,
  },
  button: {
    backgroundColor: '#800080',
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gallery: {
    alignItems: 'center',
  },
  gridItem: {
    margin: 7,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
