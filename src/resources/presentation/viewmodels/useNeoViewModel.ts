// Hook para despachar acciones a Redux
import { useDispatch, useSelector } from 'react-redux';

// Hook de estado local
import { useState } from 'react';

// Acción que se dispara para obtener datos desde la API (redux-thunk)
import { loadNeos } from '../../../store/slices/neoSlice';

// Tipo de estado global de Redux
import { RootState } from '../../../store';

export const useNeoViewModel = () => {
  // Inicializamos el despachador de acciones de Redux
  const dispatch = useDispatch();

  // Obtenemos los datos del slice `neo` en el estado global
  const { data, loading, error, fromCache } = useSelector(
    (state: RootState) => state.neo
  );

  // Estado local para fechas (valores iniciales de ejemplo)
  const [startDate, setStartDate] = useState('2025-05-19');
  const [endDate, setEndDate] = useState('2025-05-20');

  // Función que despacha la acción de búsqueda
  const search = () => {
    dispatch(loadNeos({ start: startDate, end: endDate }) as any); // as any si estás usando thunk
  };

  // Retornamos valores y métodos que usará la UI
  return {
    neos: data,         // Lista de asteroides NEO
    loading,            // Estado de carga
    error,              // Mensaje de error si existe
    fromCache,          // Indica si los datos son offline
    startDate,          // Fecha inicial
    endDate,            // Fecha final
    setStartDate,       // Setter para fecha inicial
    setEndDate,         // Setter para fecha final
    search,             // Función para ejecutar búsqueda
  };
};
