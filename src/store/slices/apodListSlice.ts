import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Apod } from '../../resources/domain/models/Apod';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { fetchApodsUseCase } from '../../resources/domain/usecases/fetchApodUseCase'; // asegúrate del nombre correcto

const repo = NasaRepositoryImpl();

interface ApodListState {
  data: Apod[];
  loading: boolean;
  error: string | null;
}

const initialState: ApodListState = {
  data: [],
  loading: false,
  error: null,
};

export const loadApodList = createAsyncThunk('apodList/load', async () => {
  const data = await fetchApodsUseCase(repo, 5);
  return data;
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
      })
      .addCase(loadApodList.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadApodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar imágenes';
      });
  },
});

export default apodListSlice.reducer;
