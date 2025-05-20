import { configureStore } from '@reduxjs/toolkit';
import apodReducer from './slices/apodSlice';
import apodListReducer from './slices/apodListSlice'; 
import neoReducer from './slices/neoSlice';
import techReducer from './slices/techSlice';

export const store = configureStore({
  reducer: {
    apod: apodReducer,
    apodList: apodListReducer, 
    neo: neoReducer,
    tech: techReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
