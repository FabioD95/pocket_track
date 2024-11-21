import { useEffect, useState } from 'react';
import fetchData from '../utils/fetchData';
import { reset, setUser } from '../store/userSlice';
import { RootState } from '../store';
import { User, UserSchema } from '../types/apiSchemas';
import { useDispatch, useSelector } from 'react-redux';

const useAuth = (): boolean | null => {
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  console.log('isAuthenticated', isAuthenticated);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(
    isAuthenticated
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      if (isAuthenticated) {
        setIsAuthorized(true);
        return;
      }

      try {
        const response = await fetchData<User>({
          method: 'get',
          route: 'users/me',
          schema: UserSchema,
        });
        dispatch(setUser({ user: response }));
        setIsAuthorized(true);
      } catch {
        setIsAuthorized(false);
        dispatch(reset());
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated, token]);

  return isAuthorized;
};

export default useAuth;
