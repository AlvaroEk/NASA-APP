import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  media_type: string;
}

export default function ApodViewer() {
  const [apodData, setApodData] = useState<ApodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      const apiKey = 'DEMO_KEY';
      const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=5`;

      try {
        const response = await axios.get(url);
        setApodData(response.data);
      } catch (err: any) {
        console.error('Error fetching APOD data:', err.message);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading APOD images...</Text>
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
      {apodData.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          {item.media_type === 'image' && (
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <Text style={styles.description}>{item.explanation}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'justify',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
