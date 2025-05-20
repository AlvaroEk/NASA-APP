import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Neo } from '../../resources/domain/models/Neo';
import { NasaRepositoryImpl } from '../../resources/data/repositories/nasaRepositoryImpl';

interface NeoState {
  data: Neo[];
  loading: boolean;
  error: string | null;
}

const initialState: NeoState = {
  data: [],
  loading: false,
  error: null,
};

const repo = NasaRepositoryImpl();

export const loadNeos = createAsyncThunk(
  'neo/load',
  async ({ start, end }: { start: string; end: string }) => {
    return await repo.fetchNeos(start, end);
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
      })
      .addCase(loadNeos.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadNeos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar NEOs';
      });
  },
});

export default neoSlice.reducer;
