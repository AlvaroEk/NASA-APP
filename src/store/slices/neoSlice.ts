import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Neo } from '../../resources/domain/models/Neo';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';
import { StorageService } from '../../service/storageService';

interface NeoState {
  data: Neo[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

const initialState: NeoState = {
  data: [],
  loading: false,
  error: null,
  fromCache: false,
};

const repo = NasaRepositoryImpl();

export const loadNeos = createAsyncThunk(
  'neo/load',
  async ({ start, end }: { start: string; end: string }) => {
    const key = `neos_${start}_${end}`;
    try {
      const data = await repo.fetchNeos(start, end);
      await StorageService.save(key, data);
      return { data, fromCache: false };
    } catch (e) {
      console.warn('🔁 NEO fallback to local cache');
      const cached = await StorageService.load<Neo[]>(key);
      if (cached) return { data: cached, fromCache: true };
      throw e;
    }
  }
);

const neoSlice = createSlice({
  name: 'neo',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadNeos.pending, state => {
        state.loading = true;
        state.error = null;
        state.fromCache = false;
      })
      .addCase(loadNeos.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.loading = false;
      })
      .addCase(loadNeos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar NEOs';
      });
  },
});

export default neoSlice.reducer;
