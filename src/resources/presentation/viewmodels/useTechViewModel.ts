import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadTechItems } from '../../../store/slices/techSlice';
import { RootState } from '../../../store';

export const useTechViewModel = () => {
  const dispatch = useDispatch();
  const { data, loading, error, fromCache } = useSelector((state: RootState) => state.tech);
  const [query, setQuery] = useState('space');

  const search = () => {
    if (query.trim()) {
      dispatch(loadTechItems(query) as any);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return {
    results: data,
    loading,
    error,
    fromCache,
    query,
    setQuery,
    search,
  };
};
