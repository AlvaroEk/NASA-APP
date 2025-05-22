import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { TechTransfer } from '../../resources/domain/models/Tech';
import { StorageService } from '../../service/storageService';

interface TechState {
  data: TechTransfer[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

const initialState: TechState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

const repo = NasaRepositoryImpl();

export const loadTechItems = createAsyncThunk(
  'tech/load',
  async (query: string) => {
    const key = `tech_software_${query.toLowerCase().trim()}`;
    try {
      const data = await repo.searchTech(query);
      await StorageService.save(key, data);
      return { data, fromCache: false };
    } catch (e) {
      console.warn('🔁 TECH fallback to local cache');
      const cached = await StorageService.load<TechTransfer[]>(key);
      if (cached) return { data: cached, fromCache: true };
      throw e;
    }
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
        state.fromCache = false;
      })
      .addCase(loadTechItems.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })
      .addCase(loadTechItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al buscar tecnologías';
      });
  },
});

export default techSlice.reducer;
