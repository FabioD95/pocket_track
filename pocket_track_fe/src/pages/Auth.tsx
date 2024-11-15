// function Auth() {
//   console.log(import.meta.env.VITE_BACKEND_URL);
//   const { isLoading, error, data } = useHttp();
//   function handleRegister() {}

//   return (
//     <div>
//       <h1>Auth</h1>
//       {isLoading && <p>Loading...</p>}
//       {error && <p>{error}</p>}
//       <button onClick={handleRegister}>register</button>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle tra login e registrazione
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isLogin
      ? await login(email, password)
      : await register(name, email, password);

    setMessage(result.message);
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Registrazione'}</h1>
      <div>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} disabled={!isLogin}>
          Registrati
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
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
        <button type="submit" disabled={loading}>
          {loading ? 'Caricamento...' : isLogin ? 'Accedi' : 'Registrati'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Auth;
