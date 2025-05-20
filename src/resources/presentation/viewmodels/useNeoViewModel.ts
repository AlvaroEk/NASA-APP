import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { loadNeos } from '../../../store/slices/neoSlice';
import { RootState } from '../../../store';

export const useNeoViewModel = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.neo);
  const [startDate, setStartDate] = useState('2025-05-19');
  const [endDate, setEndDate] = useState('2025-05-20');

  const search = () => {
    dispatch(loadNeos({ start: startDate, end: endDate }) as any);
  };

  return {
    neos: data,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    search,
  };
};
