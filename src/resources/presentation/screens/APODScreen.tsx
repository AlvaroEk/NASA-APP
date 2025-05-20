import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useApodListViewModel } from '../viewmodels/useApodViewModel';
import { Apod } from '../../domain/models/Apod'; // Asegúrate de ajustar la ruta si es diferente

export default function ApodViewer() {
  const { apods, loading, error } = useApodListViewModel();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#800080" />
        <Text>Cargando imágenes del APOD...</Text>
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
      {apods.map((item: Apod, index: number) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          {item.media_type === 'image' ? (
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
          ) : (
            <Text style={styles.description}>El contenido es un video: {item.url}</Text>
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
