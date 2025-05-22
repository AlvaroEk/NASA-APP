import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTechViewModel } from '../viewmodels/useTechViewModel';
import Animated, {
  ZoomIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function TechTransferScreen() {
  const {
    results, loading, error,
    fromCache,
    query, setQuery,
    search,
  } = useTechViewModel();

  const scale = useSharedValue(1);
  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NASA TechTransfer - Software</Text>

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar software..."
        onSubmitEditing={search}
      />

      <Pressable
        onPressIn={() => (scale.value = withSpring(0.8, { damping: 5 }))}
        onPressOut={() => {
          scale.value = withSpring(1.2, { damping: 4 });
          setTimeout(() => {
            scale.value = withSpring(1);
            search();
          }, 100);
        }}
      >
        <Animated.View style={[styles.button, animatedButton]}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Animated.View>
      </Pressable>

      {fromCache && (
        <Animated.View entering={FadeInDown.springify()} style={styles.cacheBanner}>
          <Text style={styles.cacheText}>📡 Mostrando datos en modo offline</Text>
        </Animated.View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={ZoomIn.duration(500).delay(index * 100)}
              style={styles.card}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text numberOfLines={3}>{item.description}</Text>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8 },
  button: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 10,
  },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
  cacheBanner: {
    backgroundColor: '#ffd700',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  cacheText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
