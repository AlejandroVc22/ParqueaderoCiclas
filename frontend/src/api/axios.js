import axios from 'axios';

/**
 * Resuelve la URL base de un microservicio en este orden:
 *   1. window.APP_ENV (inyectado en runtime por el contenedor → permite cambiar URLs sin rebuild).
 *   2. import.meta.env.VITE_* (build-time, útil en desarrollo).
 *   3. Default a localhost.
 */
const runtime = (typeof window !== 'undefined' && window.APP_ENV) || {};

const AUTH_BASE_URL =
  runtime.AUTH_API_URL ||
  import.meta.env.VITE_AUTH_API_URL ||
  'http://localhost:4001';

const PARQUEADERO_BASE_URL =
  runtime.PARQUEADERO_API_URL ||
  import.meta.env.VITE_PARQUEADERO_API_URL ||
  'http://localhost:4002';

const buildClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('cp_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('cp_token');
        localStorage.removeItem('cp_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authClient = buildClient(AUTH_BASE_URL);
export const parqueaderoClient = buildClient(PARQUEADERO_BASE_URL);
