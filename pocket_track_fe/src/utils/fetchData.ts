import { ZodSchema } from 'zod';
import axiosInstance from './axiosInstance';

export interface FetchData<T, B = object> {
  methot: 'get' | 'post' | 'put' | 'delete';
  route: string;
  body?: B; // Tipo del corpo della richiesta
  schema?: ZodSchema<T>;
}

export default async function fetchData<T, B = object>({
  methot,
  route,
  body,
  schema,
}: FetchData<T, B>): Promise<T> {
  const response = await axiosInstance({
    method: methot,
    url: route,
    data: body,
  });

  if (response.statusText !== 'OK') throw new Error('Failed to fetch data');

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
