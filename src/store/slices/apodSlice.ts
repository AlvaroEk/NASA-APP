import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Apod } from '../../resources/domain/models/Apod';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { fetchApodUseCase } from '../../resources/domain/usecases/fetchApodUseCase';

interface ApodState {
  data: Apod | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApodState = {
  data: null,
  loading: false,
  error: null,
};

const repo = NasaRepositoryImpl();

export const loadApod = createAsyncThunk('apod/load', async () => {
  return await fetchApodUseCase(repo);
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
      })
      .addCase(loadApod.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadApod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar APOD';
      });
  },
});

export default apodSlice.reducer;
