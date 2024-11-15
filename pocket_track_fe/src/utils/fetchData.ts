import axios from 'axios';

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
  const response = await axios({
    method: methot,
    url: `${url}/${route}`,
    headers: autorization
      ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
      : undefined,
    data: body ? body : undefined,
  });

  if (response.statusText !== 'OK') throw new Error('Failed to fetch data');
  return response.data;
}
