// Importamos AsyncStorage para manejar almacenamiento local persistente
import AsyncStorage from '@react-native-async-storage/async-storage';

// Exportamos un objeto con métodos reutilizables para guardar y cargar datos
export const StorageService = {
  // Método para guardar un valor genérico en AsyncStorage
  async save<T>(key: string, value: T): Promise<void> {
    try {
      // Convertimos el valor a JSON antes de guardarlo
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      // Mostramos error si falla el guardado
      console.error(`Error saving ${key}:`, e);
    }
  },

  // Método para recuperar un valor genérico desde AsyncStorage
  async load<T>(key: string): Promise<T | null> {
    try {
      // Obtenemos el valor en forma de string
      const json = await AsyncStorage.getItem(key);

      // Si existe, lo parseamos de vuelta a objeto; si no, retornamos null
      return json ? JSON.parse(json) : null;
    } catch (e) {
      // Mostramos error si falla la lectura
      console.error(`Error loading ${key}:`, e);
      return null;
    }
  },
};
