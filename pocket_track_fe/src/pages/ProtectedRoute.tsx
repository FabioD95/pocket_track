import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const authenticated = useAuth();

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
