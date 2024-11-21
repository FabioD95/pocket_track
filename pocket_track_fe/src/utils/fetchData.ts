import { ZodSchema } from 'zod';
import axiosInstance from './axiosInstance';
import { reset } from '../store/userSlice';
import store from '../store';

export interface FetchData<T, B = object> {
  method: 'get' | 'post' | 'put' | 'delete';
  route: string;
  body?: B; // Tipo del corpo della richiesta
  params?: B; // Parametri di query per GET request
  schema?: ZodSchema<T>; // Schema per validare la risposta
}

export default async function fetchData<T, B = object>({
  method,
  route,
  body,
  params,
  schema,
}: FetchData<T, B>): Promise<T> {
  const response = await axiosInstance({
    method: method,
    url: route,
    data: method !== 'get' ? body : undefined, // Solo POST/PUT/DELETE usano body
    params: method === 'get' ? params : undefined, // Solo GET usa queryParams
  });

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 401) {
      store.dispatch(reset());
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch data');
  }

  const data = response.data;

  if (schema) {
    try {
      return schema.parse(data);
    } catch (error) {
      console.error('Schema validation failed:', error);
      throw new Error('Validation failed. Please contact support.');
    }
  }

  return data as T;
}
