/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

interface AuthResponse {
  success: boolean;
  message: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        { email, password }
      );
      dispatch(
        loginSuccess({ user: response.data.user, token: response.data.token })
      );
      return { success: true, message: 'Login completato con successo!' };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore durante il login');
      return { success: false, message: error || 'Errore durante il login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        name,
        email,
        password,
      });
      return {
        success: true,
        message: 'Registrazione completata con successo!',
      };
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Errore durante la registrazione'
      );
      return {
        success: false,
        message: error || 'Errore durante la registrazione',
      };
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
