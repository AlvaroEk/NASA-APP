// Importaciones necesarias para crear slices y lógica asíncrona
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Modelo del dominio que representa un asteroide cercano (NEO)
import { Neo } from '../../resources/domain/models/Neo';

// Repositorio que implementa la lógica para obtener datos desde la API
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';

// Servicio de almacenamiento local para modo offline
import { StorageService } from '../../service/storageService';

// Estructura del estado global para el módulo NEO
interface NeoState {
  data: Neo[];              // Lista de asteroides
  loading: boolean;         // Estado de carga
  error: string | null;     // Mensaje de error
  fromCache: boolean;       // Indica si los datos vienen del almacenamiento local
}

// Estado inicial del slice
const initialState: NeoState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

// Instanciamos el repositorio NASA
const repo = NasaRepositoryImpl();

// 🎯 Thunk asincrónico que carga NEOs entre dos fechas
export const loadNeos = createAsyncThunk(
  'neo/load',
  async ({ start, end }: { start: string; end: string }) => {
    const key = `neos_${start}_${end}`; // clave única para caché

    try {
      // Llamada al repositorio para obtener los datos desde la API
      const data = await repo.fetchNeos(start, end);
      await StorageService.save(key, data); // Guardamos los datos localmente
      return { data, fromCache: false };    // Indicamos que son datos en línea
    } catch (e) {
      console.warn('🔁 NEO fallback to local cache');

      // Si falla, intentamos recuperar datos desde almacenamiento local
      const cached = await StorageService.load<Neo[]>(key);
      if (cached) return { data: cached, fromCache: true }; // datos cacheados

      throw e; // lanzamos el error si no hay datos cacheados
    }
  }
);

// 📦 Slice Redux que gestiona el estado del módulo NEO
const neoSlice = createSlice({
  name: 'neo',
  initialState,
  reducers: {}, // No se necesitan reducers tradicionales
  extraReducers: builder => {
    builder
      // Cuando comienza la carga
      .addCase(loadNeos.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })

      // Cuando se completa la carga exitosamente
      .addCase(loadNeos.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })

      // Cuando ocurre un error
      .addCase(loadNeos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar NEOs';
      });
  },
});

// Exportamos solo el reducer para usarlo en el store
export default neoSlice.reducer;
