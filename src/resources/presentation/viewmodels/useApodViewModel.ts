import { useEffect, useState } from 'react';
import { Apod } from '../../domain/models/Apod';
import { NasaRepositoryImpl } from '../../data/repositories/nasaRepositoryImpl';
import { StorageService } from '../../../service/storageService';
import axios from 'axios';

const repo = NasaRepositoryImpl();

export const useApodListViewModel = () => {
  const [apods, setApods] = useState<Apod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadApods = async () => {
    setLoading(true);
    try {
      const newApods = await repo.fetchMultipleApods(5);
      const updated = [...apods, ...newApods];
      setApods(updated);
      await StorageService.save('apodList', updated);
      setFromCache(false);
    } catch (e: any) {
      const isOffline = axios.isAxiosError(e) && !e.response;

      console.warn('🔁 APOD fallback to local cache', isOffline ? '(no internet)' : '(server error)');

      if (isOffline) {
        const cached = await StorageService.load<Apod[]>('apodList');
        if (cached) {
          setApods(cached);
          setFromCache(true);
        } else {
          setError('No hay conexión y no se encontraron datos locales');
        }
      } else {
        setError('Error al obtener datos del servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApods();
  }, []);

  return {
    apods,
    loading,
    error,
    fromCache,
    loadApods,
  };
};
