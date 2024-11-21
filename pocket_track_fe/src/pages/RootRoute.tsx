import LandingPage from './LandingPage';
import App from './App';
import useAuth from '../hooks/useAuth';
import SplashScreen from './SplashScreen';

const RootRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) return <SplashScreen />;

  return isAuthenticated ? <App /> : <LandingPage />;
};

export default RootRoute;
