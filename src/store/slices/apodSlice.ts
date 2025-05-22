// Importamos herramientas de Redux Toolkit para estado global y lógica asincrónica
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Modelo de dominio para una imagen APOD
import { Apod } from '../../resources/domain/models/Apod';

// Repositorio que implementa la obtención de datos desde la API de NASA
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';

// Caso de uso para obtener un único APOD
import { fetchApodUseCase } from '../../resources/domain/usecases/fetchApodUseCase';

// Servicio local de almacenamiento (modo offline)
import { StorageService } from '../../service/storageService';

// 🧠 Estructura del estado que manejará este slice
interface ApodState {
  data: Apod | null;             // Imagen actual del día
  loading: boolean;              // Indicador de carga
  error: string | null;          // Mensaje de error
  fromCache: boolean;           // Indica si los datos fueron cargados desde caché
}

// Estado inicial
const initialState: ApodState = {
  data: null,
  loading: false,
  error: null,
  fromCache: false,
};

// Instancia del repositorio NASA
const repo = NasaRepositoryImpl();

// 🛰️ Thunk asincrónico que maneja la carga del APOD (con fallback offline)
export const loadApod = createAsyncThunk('apod/load', async () => {
  try {
    // Intentamos obtener desde la API
    const data = await fetchApodUseCase(repo);
    await StorageService.save('apod', data); // Guardamos localmente
    return { data, fromCache: false };       // Retornamos resultado exitoso
  } catch (e) {
    console.warn('🔁 APOD fallback to local cache');

    // Si hay error, intentamos recuperar desde caché
    const cached = await StorageService.load<Apod>('apod');
    if (cached) return { data: cached, fromCache: true };

    throw e; // Si tampoco hay caché, lanzamos el error original
  }
});

// 📦 Slice que maneja el estado del APOD
const apodSlice = createSlice({
  name: 'apod',             // Nombre del slice
  initialState,             // Estado inicial
  reducers: {},             // No usamos reducers síncronos

  // Reducers adicionales para manejar los estados del thunk
  extraReducers: builder => {
    builder
      // Cuando comienza la carga
      .addCase(loadApod.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })

      // Cuando la carga termina exitosamente
      .addCase(loadApod.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })

      // Cuando ocurre un error
      .addCase(loadApod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar APOD';
      });
  },
});

// Exportamos solo el reducer para usarlo en el store
export default apodSlice.reducer;
