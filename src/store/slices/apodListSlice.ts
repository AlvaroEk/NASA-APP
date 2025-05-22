import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Apod } from '../../resources/domain/models/Apod';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { fetchApodsUseCase } from '../../resources/domain/usecases/fetchApodUseCase';
import { StorageService } from '../../service/storageService';

const repo = NasaRepositoryImpl();

interface ApodListState {
  data: Apod[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

const initialState: ApodListState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

export const loadApodList = createAsyncThunk('apodList/load', async () => {
  try {
    const data = await fetchApodsUseCase(repo, 5);
    await StorageService.save('apodList', data);
    return { data, fromCache: false };
  } catch (e) {
    console.warn('🔁 APOD fallback to local cache');
    const cached = await StorageService.load<Apod[]>('apodList');
    if (cached) return { data: cached, fromCache: true };
    throw e;
  }
});

const apodListSlice = createSlice({
  name: 'apodList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadApodList.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })
      .addCase(loadApodList.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })
      .addCase(loadApodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar imágenes';
      });
  },
});

export default apodListSlice.reducer;
