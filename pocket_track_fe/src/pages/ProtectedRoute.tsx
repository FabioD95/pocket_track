import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) return <SplashScreen />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;

export function SplashScreen() {
  return (
    <div>
      <h1>SplashScreen</h1>
      <img
        src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
        alt="loading"
      />
      Loading...
    </div>
  );
}
