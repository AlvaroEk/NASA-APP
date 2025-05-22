import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Apod } from '../../resources/domain/models/Apod';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { fetchApodUseCase } from '../../resources/domain/usecases/fetchApodUseCase';
import { StorageService } from '../../service/storageService';

interface ApodState {
  data: Apod | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

const initialState: ApodState = {
  data: null,
  loading: false,
  error: null,
  fromCache: false,
};

const repo = NasaRepositoryImpl();

export const loadApod = createAsyncThunk('apod/load', async () => {
  try {
    const data = await fetchApodUseCase(repo);
    await StorageService.save('apod', data);
    return { data, fromCache: false };
  } catch (e) {
    console.warn('🔁 APOD fallback to local cache');
    const cached = await StorageService.load<Apod>('apod');
    if (cached) return { data: cached, fromCache: true };
    throw e;
  }
});

const apodSlice = createSlice({
  name: 'apod',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadApod.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })
      .addCase(loadApod.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })
      .addCase(loadApod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar APOD';
      });
  },
});

export default apodSlice.reducer;
