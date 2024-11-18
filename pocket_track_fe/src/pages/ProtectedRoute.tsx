import { Navigate, Outlet } from 'react-router-dom';
import store from '../store';
import fetchData from '../utils/fetchData';
import { useEffect, useState } from 'react';
import { setUser } from '../store/authSlice';

interface User {
  id: string;
  email: string;
  name: string;
}

const isAuthenticated = async (): Promise<boolean> => {
  const state = store.getState();
  const token = state.auth.token;

  if (!token) return false;
  try {
    const response = await fetchData({
      methot: 'get',
      route: 'users/me',
    });

    const user = response as User;

    store.dispatch(setUser({ user }));
    return true;
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result);
    };
    checkAuth();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
