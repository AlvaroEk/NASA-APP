// Importamos hooks de React
import { useEffect, useState } from 'react';

// Modelo de datos del dominio para APOD (Astronomy Picture of the Day)
import { Apod } from '../../domain/models/Apod';

// Repositorio que encapsula la lógica de acceso a la API
import { NasaRepositoryImpl } from '../../data/repositories/nasaRepositoryImpl';

// Servicio de almacenamiento local (AsyncStorage)
import { StorageService } from '../../../service/storageService';

// Cliente HTTP para verificar errores de red
import axios from 'axios';

// Instanciamos el repositorio NASA
const repo = NasaRepositoryImpl();

export const useApodListViewModel = () => {
  // Estados locales para lista de APODs, carga, error y si provienen del cache
  const [apods, setApods] = useState<Apod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  // Función principal para cargar los datos
  const loadApods = async () => {
    setLoading(true);
    try {
      // Llamada a API para obtener múltiples imágenes APOD
      const newApods = await repo.fetchMultipleApods(5);

      // Combinamos con los existentes (acumulativo)
      const updated = [...apods, ...newApods];
      setApods(updated);

      // Guardamos en caché local
      await StorageService.save('apodList', updated);
      setFromCache(false);
    } catch (e: any) {
      // Detectamos si el error fue por falta de conexión
      const isOffline = axios.isAxiosError(e) && !e.response;

      console.warn('🔁 APOD fallback to local cache', isOffline ? '(no internet)' : '(server error)');

      if (isOffline) {
        // Intentamos recuperar desde almacenamiento local
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
      // Terminamos la carga
      setLoading(false);
    }
  };

  // Ejecuta la carga al montar el componente
  useEffect(() => {
    loadApods();
  }, []);

  // Devolvemos el estado y métodos necesarios a la UI
  return {
    apods,
    loading,
    error,
    fromCache,
    loadApods,
  };
};
