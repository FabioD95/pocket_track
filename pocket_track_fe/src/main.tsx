import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './fonts/Menlo-Regular.ttf';

import './index.css';
import store, { persistor } from './store';
import Auth from './pages/Auth.tsx';
import ProtectedRoute from './pages/ProtectedRoute.tsx';
import NewTransaction from './pages/NewTransaction.tsx';
import RootRoute from './pages/RootRoute.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ThemeProvider from './pages/ThemeProvider.tsx';

console.log('App is loading...');

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB9k3L_EKUDUiE6-XOpz_AAYK2V0-wldvE',
  authDomain: 'pocket-app-track.firebaseapp.com',
  projectId: 'pocket-app-track',
  storageBucket: 'pocket-app-track.firebasestorage.app',
  messagingSenderId: '575597541966',
  appId: '1:575597541966:web:464184795e0dde7634211f',
  measurementId: 'G-2KMXEL4L9H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
getAnalytics(app);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootRoute />, // Gestione personalizzata della root
    },
    {
      path: '/auth',
      element: <Auth />,
    },
    {
      path: '/', // Rotte protette senza prefisso
      element: <ProtectedRoute />,
      children: [
        {
          path: 'new_transaction', // Direttamente sotto '/'
          element: <NewTransaction />,
        },
        // Puoi aggiungere altre rotte protette qui
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    // basename: '/pocket_track', // Specifica il prefisso delle rotte
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true,
            }}
          />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
