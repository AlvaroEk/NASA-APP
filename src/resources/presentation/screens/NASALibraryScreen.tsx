import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Dimensions
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types/navigation';

interface NasaItem {
  title: string;
  description: string;
  imageUrl: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

export default function NASALibraryScreen() {
  const [searchTerm, setSearchTerm] = useState('galaxy');
  const [query, setQuery] = useState('galaxy');
  const [items, setItems] = useState<NasaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const numColumns = 2;
  const imageSize = Dimensions.get('window').width / numColumns - 30;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
        );
        const rawItems = response.data.collection.items;

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

        setItems(parsedItems.slice(0, 30));
        setError(null);
      } catch (err: any) {
        console.error('NASA LIBRARY error:', err.message);
        setError('Failed to fetch NASA library data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setQuery(searchTerm.trim());
    }
  };

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
