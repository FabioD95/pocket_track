import LandingPage from './LandingPage';
import App from '../App';
import useAuth from '../hooks/useAuth';

const RootRoute = () => {
  const authenticated = useAuth();

  return authenticated ? <App /> : <LandingPage />;
};

export default RootRoute;
