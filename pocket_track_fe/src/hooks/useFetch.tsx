import { useState } from 'react';
import fetchData, { FetchData } from '../utils/fetchData';

export interface UseFetch {
  loading: boolean;
  error: string | null;
  data: object | null;
  setData: React.Dispatch<React.SetStateAction<object | null>>;
  fetchFn: () => Promise<void>;
}

export default function useFetch(props: FetchData): UseFetch {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<object | null>(null);

  async function fetchFn() {
    setLoading(true);
    try {
      const response = await fetchData(props);
      setData(response);
      setError(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else throw new Error('Failed to fetch data');
    }
    setLoading(false);
  }

  return { loading, error, data, setData, fetchFn };
}
