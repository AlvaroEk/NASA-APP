import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { useApodListViewModel } from '../viewmodels/useApodViewModel';
import { Apod } from '../../domain/models/Apod';
import Animated, {
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function ApodViewer() {
  const { apods, loading, error, fromCache, loadApods } = useApodListViewModel();
  const scale = useSharedValue(1);

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {fromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheText}>📡 Mostrando datos en modo offline</Text>
        </View>
      )}

      {apods.map((item: Apod, index: number) => (
        <Animated.View
          key={index}
          entering={ZoomIn.duration(500).delay(index * 100)}
          style={styles.card}
        >
          <Text style={styles.title}>{item.title}</Text>
          {item.media_type === 'image' ? (
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
          ) : (
            <Text style={styles.description}>Video: {item.url}</Text>
          )}
          <Text style={styles.description}>{item.explanation}</Text>
        </Animated.View>
      ))}

      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : (
        <Pressable
          onPressIn={() => (scale.value = withSpring(0.8, { damping: 5 }))}
          onPressOut={() => {
            scale.value = withSpring(1.2, { damping: 4 });
            setTimeout(() => {
              scale.value = withSpring(1);
              loadApods();
            }, 100);
          }}
        >
          <Animated.View style={[styles.button, animatedButton]}>
            <Text style={styles.buttonText}>Cargar más</Text>
          </Animated.View>
        </Pressable>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  card: { marginBottom: 30, width: '100%' },
  image: { width: '100%', height: 300, marginVertical: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  description: { fontSize: 16, marginTop: 5, textAlign: 'justify' },
  errorText: { color: 'red', fontSize: 18 },
  button: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  cacheBanner: {
    backgroundColor: '#ffd700',
    padding: 8,
    borderRadius: 5,
    marginBottom: 12,
  },
  cacheText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
