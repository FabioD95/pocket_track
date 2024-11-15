import { useState } from 'react';

import useFetch from '../hooks/useFetch';

export default function Auth() {
  //   const [isLogin, setIsLogin] = useState(true);
  //   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, fetchFn } = useFetch({
    methot: 'post',
    route: 'users/login',
    body: { email, password },
    autorization: false,
    // dispatch function
  });

  function handleSubmit() {
    fetchFn();
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
