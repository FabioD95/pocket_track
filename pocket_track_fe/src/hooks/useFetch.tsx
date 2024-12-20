import { useState, useCallback, useMemo } from 'react';
import fetchData, { FetchData } from '../utils/fetchData';

export interface UseFetch<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  fetchFn: (props: FetchData<T, object>) => Promise<void>;
}

export default function useFetch<T = object>(): UseFetch<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchFn = useCallback(async (props: FetchData<T, object>) => {
    setLoading(true);
    try {
      const response = await fetchData<T, object>(props);
      setData(response);
      setError(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else throw new Error('Failed to fetch data');
    }
    setLoading(false);
  }, []);

  const result = useMemo(
    () => ({
      loading,
      error,
      data,
      setData,
      fetchFn,
    }),
    [loading, error, data, fetchFn]
  );

  return result;
}
