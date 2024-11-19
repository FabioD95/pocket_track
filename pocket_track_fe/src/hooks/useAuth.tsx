import { useEffect, useState } from 'react';
import fetchData from '../utils/fetchData';
import { setUser } from '../store/authSlice';
import store from '../store';
import { User, UserSchema } from '../types/apiSchemas';

const useAuth = (): boolean | null => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const state = store.getState();
      const token = state.auth.token;

      if (!token) {
        setAuthenticated(false);
        return;
      }

      try {
        const response = await fetchData<User>({
          method: 'get',
          route: 'users/me',
          schema: UserSchema,
        });
        store.dispatch(setUser({ user: response }));
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return authenticated;
};

export default useAuth;
