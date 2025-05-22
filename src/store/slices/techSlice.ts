// Herramientas de Redux Toolkit para crear slices y lógica asíncrona
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Repositorio que implementa el acceso a la API de TechTransfer
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';

// Modelo del dominio que representa un ítem de tecnología/software
import { TechTransfer } from '../../resources/domain/models/Tech';

// Servicio para almacenamiento local (AsyncStorage)
import { StorageService } from '../../service/storageService';

// Estructura del estado para el slice TechTransfer
interface TechState {
  data: TechTransfer[];        // Lista de tecnologías disponibles
  loading: boolean;            // Estado de carga
  error: string | null;        // Mensaje de error si ocurre
  fromCache: boolean;          // Indica si los datos fueron recuperados offline
}

// Estado inicial del slice
const initialState: TechState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

// Instanciamos el repositorio NASA
const repo = NasaRepositoryImpl();

// 🔍 Thunk asíncrono para buscar tecnologías/software por palabra clave
export const loadTechItems = createAsyncThunk(
  'tech/load',                   // Nombre de la acción
  async (query: string) => {
    const key = `tech_software_${query.toLowerCase().trim()}`; // clave de caché única por búsqueda

    try {
      // Obtenemos resultados desde la API
      const data = await repo.searchTech(query);
      await StorageService.save(key, data); // Guardamos localmente
      return { data, fromCache: false };    // Retornamos datos en línea
    } catch (e) {
      console.warn('🔁 TECH fallback to local cache');

      // Si hay error, intentamos recuperar desde caché
      const cached = await StorageService.load<TechTransfer[]>(key);
      if (cached) return { data: cached, fromCache: true };

      throw e; // Si no hay datos cacheados, lanzamos el error original
    }
  }
);

// 📦 Slice que gestiona el estado global de tecnologías/software NASA
const techSlice = createSlice({
  name: 'tech',
  initialState,
  reducers: {}, // No usamos reducers tradicionales
  extraReducers: builder => {
    builder
      // Acción cuando inicia la carga
      .addCase(loadTechItems.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })

      // Acción cuando se completan los datos exitosamente
      .addCase(loadTechItems.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })

      // Acción cuando ocurre un error
      .addCase(loadTechItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al buscar tecnologías';
      });
  },
});

// Exportamos el reducer para incluirlo en el store global
export default techSlice.reducer;
