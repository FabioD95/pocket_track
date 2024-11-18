import { useDispatch } from 'react-redux';

import useFetch from '../hooks/useFetch';
import { loginSuccess } from '../store/authSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthResponse, AuthResponseSchema } from '../types/apiSchemas';

export default function Auth() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const { loading, error, data, fetchFn } = useFetch<AuthResponse>();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    fetchFn({
      methot: 'post',
      route: `users/${isLogin ? 'login' : 'register'}`,
      schema: AuthResponseSchema,
      body: {
        name: formData.get('name') ?? (undefined as string | undefined),
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      },
    });
  }

  if (data) {
    dispatch(loginSuccess({ token: data.token }));
  }

  return (
    <>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <button onClick={() => setIsLogin((login) => !login)}>
        {isLogin ? 'Register' : 'Login'}
      </button>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input name="name" type="text" placeholder="Name" required />
        )}
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button>submit</button>
      </form>

      <Link to="/">home</Link>
      <Link to="/new-transaction">new-transaction</Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </>
  );
}
