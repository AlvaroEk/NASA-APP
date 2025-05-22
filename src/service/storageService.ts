import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  async save<T>(key: string, value: T): Promise<void> {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.error(`Error saving ${key}:`, e);
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.error(`Error loading ${key}:`, e);
      return null;
    }
  },
};
