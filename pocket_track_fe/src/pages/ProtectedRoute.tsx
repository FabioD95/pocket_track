import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import SplashScreen from './SplashScreen';

const ProtectedRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) return <SplashScreen />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
