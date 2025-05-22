// Función de Redux Toolkit para configurar el store con buena DX y middleware incluido
import { configureStore } from '@reduxjs/toolkit';

// Importamos todos los reducers (slices) de cada módulo de estado
import apodReducer from './slices/apodSlice';              // Imagen APOD individual
import apodListReducer from './slices/apodListSlice';      // Lista de APODs
import neoReducer from './slices/neoSlice';                // Asteroides NEO
import techReducer from './slices/techSlice';              // Software TechTransfer

// Creamos el store de Redux
export const store = configureStore({
  reducer: {
    // Mapeo de cada slice al nombre de su propiedad en el estado global
    apod: apodReducer,
    apodList: apodListReducer,
    neo: neoReducer,
    tech: techReducer,
  },
});

// Tipo raíz del estado global de Redux (usado con useSelector)
export type RootState = ReturnType<typeof store.getState>;

// Tipo del despachador (usado con useDispatch para tipar correctamente acciones asíncronas)
export type AppDispatch = typeof store.dispatch;
