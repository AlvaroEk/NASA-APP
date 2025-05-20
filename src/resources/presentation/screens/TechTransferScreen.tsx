import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTechViewModel } from '../viewmodels/useTechViewModel';

export default function TechTransferScreen() {
  const {
    results, loading, error,
    query, setQuery,
    search,
  } = useTechViewModel();

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

      <TouchableOpacity style={styles.button} onPress={search}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text numberOfLines={3}>{item.description}</Text>
            </View>
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
  button: { backgroundColor: '#800080', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red' },
});
