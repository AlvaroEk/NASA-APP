import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface APODData {
  title: string;
  explanation: string;
  url: string;
}

interface NASAState {
  apodData: APODData | null;
  loading: boolean;
}

const initialState: NASAState = {
  apodData: null,
  loading: false,
};

const nasaSlice = createSlice({
  name: "nasa",
  initialState,
  reducers: {
    setAPODData: (state, action: PayloadAction<APODData>) => {
      state.apodData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAPODData, setLoading } = nasaSlice.actions;
export default nasaSlice.reducer;
