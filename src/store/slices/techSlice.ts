import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { TechTransfer } from '../../resources/domain/models/Tech';

interface TechState {
  data: TechTransfer[];
  loading: boolean;
  error: string | null;
}

const initialState: TechState = {
  data: [],
  loading: false,
  error: null,
};

const repo = NasaRepositoryImpl();

export const loadTechItems = createAsyncThunk(
  'tech/load',
  async (query: string) => {
    return await repo.searchTech(query);
  }
);

const techSlice = createSlice({
  name: 'tech',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadTechItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTechItems.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadTechItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al buscar tecnologías';
      });
  },
});

export default techSlice.reducer;
