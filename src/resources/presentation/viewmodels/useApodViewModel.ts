import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadApodList  } from '../../../store/slices/apodListSlice';
import { RootState } from '../../../store';

export const useApodListViewModel = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.apodList);

  useEffect(() => {
    dispatch(loadApodList() as any);
  }, []);

  return {
    apods: data,
    loading,
    error,
  };
};