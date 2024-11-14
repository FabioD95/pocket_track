import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from './store';
import App from './App.tsx';
import Auth from './pages/Auth.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <App /> },
      { path: 'auth', element: <Auth /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
