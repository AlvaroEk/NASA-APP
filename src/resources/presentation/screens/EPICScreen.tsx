import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface EpicItem {
  image: string;
  date: string;
  caption: string;
}

export default function EpicViewer() {
  const [epicData, setEpicData] = useState<EpicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEPIC = async () => {
      const apiKey = 'DEMO_KEY';
      const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const items = response.data.slice(0, 5);
        setEpicData(items);
      } catch (err: any) {
        console.error('Error fetching EPIC data:', err.message);
        setError('Failed to fetch EPIC images.');
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
        <View key={index} style={styles.card}>
          <Text style={styles.title}>📅 {item.date}</Text>
          <Image
            source={{ uri: getImageUrl(item) }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.description}>{item.caption}</Text>
        </View>
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
