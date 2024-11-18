import { useState } from 'react';
import fetchData, { FetchData } from '../utils/fetchData';

export interface UseFetch<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  fetchFn: (props: FetchData) => Promise<void>;
}

export default function useFetch<T = object>(): UseFetch<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  async function fetchFn(props: FetchData) {
    setLoading(true);
    try {
      const response = await fetchData(props);
      setData(response as T);
      setError(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else throw new Error('Failed to fetch data');
    }
    setLoading(false);
  }

  return { loading, error, data, setData, fetchFn };
}
