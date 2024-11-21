import axios from 'axios';
import store from '../store';
import { reset } from '../store/userSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const {
      user: { token },
    } = store.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('request error', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized, resetting store...');
      store.dispatch(reset());
    }
    console.log('response error', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
