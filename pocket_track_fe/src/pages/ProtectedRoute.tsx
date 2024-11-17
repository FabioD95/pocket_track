import { Navigate, Outlet } from 'react-router-dom';
import store from '../store';
import fetchData from '../utils/fetchData';
import { useEffect, useState } from 'react';
import { setUser } from '../store/authSlice';

const isAuthenticated = async (): Promise<boolean> => {
  const state = store.getState();
  const token = state.auth.token;

  if (!token) return false;
  try {
    const response = await fetchData({
      methot: 'get',
      route: 'users/me',
    });
    console.log(response);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.dispatch(setUser({ user: response }));
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
