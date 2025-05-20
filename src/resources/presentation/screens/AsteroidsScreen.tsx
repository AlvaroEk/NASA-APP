import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNeoViewModel } from '../viewmodels/useNeoViewModel';

export default function AsteroidsScreen() {
  const {
    neos, loading, error,
    startDate, endDate,
    setStartDate, setEndDate,
    search,
  } = useNeoViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asteroides Cercanos</Text>

      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Fecha inicio" />
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Fecha fin" />
      <TouchableOpacity style={styles.button} onPress={search}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={neos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>Magnitud: {item.absolute_magnitude_h}</Text>
              <Text>Peligroso: {item.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8 },
  button: { backgroundColor: '#800080', padding: 10, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff' },
  card: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red' },
});
