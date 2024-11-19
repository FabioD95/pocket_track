import { ZodSchema } from 'zod';
import axiosInstance from './axiosInstance';

export interface FetchData<T, B = object> {
  method: 'get' | 'post' | 'put' | 'delete';
  route: string;
  body?: B; // Tipo del corpo della richiesta
  schema?: ZodSchema<T>;
}

export default async function fetchData<T, B = object>({
  method,
  route,
  body,
  schema,
}: FetchData<T, B>): Promise<T> {
  const response = await axiosInstance({
    method: method,
    url: route,
    data: body,
  });

  if (response.status !== 200 && response.status !== 201)
    throw new Error('Failed to fetch data');

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
