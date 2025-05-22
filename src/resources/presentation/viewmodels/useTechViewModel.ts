// Hooks de Redux para despachar acciones y seleccionar estado global
import { useDispatch, useSelector } from 'react-redux';

// Hooks de React para estado local y efectos
import { useEffect, useState } from 'react';

// Acción asíncrona del slice de TechTransfer (usa Redux Toolkit + thunk)
import { loadTechItems } from '../../../store/slices/techSlice';

// Tipo raíz del estado de Redux
import { RootState } from '../../../store';

export const useTechViewModel = () => {
  // Hook para disparar acciones Redux
  const dispatch = useDispatch();

  // Extraemos los valores del slice tech del estado global
  const { data, loading, error, fromCache } = useSelector(
    (state: RootState) => state.tech
  );

  // Estado local para la palabra clave de búsqueda
  const [query, setQuery] = useState('space');

  // Función que dispara la búsqueda usando la palabra clave actual
  const search = () => {
    if (query.trim()) {
      dispatch(loadTechItems(query) as any); // Ejecuta thunk de Redux
    }
  };

  // Ejecutamos una búsqueda automática cuando el componente se monta
  useEffect(() => {
    search();
  }, []);

  // Devolvemos los valores y funciones que usará la vista
  return {
    results: data,     // Resultados devueltos por la API
    loading,           // Estado de carga
    error,             // Error si existe
    fromCache,         // Si los datos vinieron desde almacenamiento local
    query,             // Texto de búsqueda
    setQuery,          // Setter para la búsqueda
    search,            // Función para lanzar la búsqueda
  };
};
