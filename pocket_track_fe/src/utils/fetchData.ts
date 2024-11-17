import axios from 'axios';
import store from '../store';

export interface FetchData {
  methot: 'get' | 'post' | 'put' | 'delete';
  route: string;
  body?: object;
  autorization?: boolean;
}

const url = import.meta.env.VITE_BACKEND_URL;

export default async function fetchData({
  methot,
  route,
  body,
  autorization = true,
}: FetchData): Promise<object> {
  const state = store.getState();
  const token = state.auth.token;
  const response = await axios({
    method: methot,
    url: `${url}/${route}`,
    headers: autorization ? { Authorization: `Bearer ${token}` } : undefined,
    data: body ? body : undefined,
  });

  if (response.statusText !== 'OK') throw new Error('Failed to fetch data');
  return response.data;
}
