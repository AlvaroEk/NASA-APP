// Importamos herramientas de Redux Toolkit para crear slices y thunks asíncronos
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Modelo de datos para una imagen APOD
import { Apod } from '../../resources/domain/models/Apod';

// Repositorio de la NASA que implementa las llamadas a la API
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';

// Caso de uso que obtiene múltiples APODs (desde dominio)
import { fetchApodsUseCase } from '../../resources/domain/usecases/fetchApodUseCase';

// Servicio de almacenamiento local para modo offline
import { StorageService } from '../../service/storageService';

// Instanciamos el repositorio a usar
const repo = NasaRepositoryImpl();

// Definimos el tipo de estado que manejará este slice
interface ApodListState {
  data: Apod[];           // Lista de imágenes APOD
  loading: boolean;       // Indicador de carga
  error: string | null;   // Mensaje de error si ocurre
  fromCache: boolean;     // Indica si los datos vienen del almacenamiento local
}

// Estado inicial del slice
const initialState: ApodListState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

// Thunk asincrónico que obtiene la lista de APODs desde el caso de uso
export const loadApodList = createAsyncThunk('apodList/load', async () => {
  try {
    const data = await fetchApodsUseCase(repo, 5);            // Llamamos al use case con el repositorio
    await StorageService.save('apodList', data);              // Guardamos los datos localmente
    return { data, fromCache: false };                        // Retornamos los datos (no son de cache)
  } catch (e) {
    console.warn('🔁 APOD fallback to local cache');
    const cached = await StorageService.load<Apod[]>('apodList');
    if (cached) return { data: cached, fromCache: true };     // Si hay cache, lo usamos
    throw e;                                                  // Si no, lanzamos el error original
  }
});

// Creamos el slice de Redux para gestionar estado de APODs
const apodListSlice = createSlice({
  name: 'apodList',              // Nombre del slice
  initialState,
  reducers: {},                  // No definimos reducers clásicos, solo extraReducers
  extraReducers: builder => {
    builder
      // Acción: carga iniciada
      .addCase(loadApodList.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })

      // Acción: carga exitosa
      .addCase(loadApodList.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })

      // Acción: carga fallida
      .addCase(loadApodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar imágenes';
      });
  },
});

// Exportamos solo el reducer para integrarlo en el store
export default apodListSlice.reducer;
