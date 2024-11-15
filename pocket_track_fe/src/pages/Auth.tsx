import { useState } from 'react';
import { useDispatch } from 'react-redux';

import useFetch from '../hooks/useFetch';
import { loginSuccess } from '../store/authSlice';

export default function Auth() {
  const dispatch = useDispatch();

  //   const [isLogin, setIsLogin] = useState(true);
  //   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, data, fetchFn } = useFetch({
    methot: 'post',
    route: 'users/login',
    body: { email, password },
    autorization: false,
  });

  function handleSubmit() {
    fetchFn();
  }

  if (data) {
    const useData = data as { token: string };
    dispatch(loginSuccess({ user: null, token: useData.token }));
  }

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={handleSubmit}>submit</button>
    </>
  );
}
