import axios from 'axios';
import { setToken, getToken, clearToken } from './token-cache';

// In production (Vercel), VITE_API_BASE_URL is the full backend URL.
// In local dev, use '/api/v1' so Vite proxy handles CORS.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken() ?? localStorage.getItem('quiz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = navigator.language.split('-')[0] ?? 'en';
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('quiz_refresh_token');
      if (!refreshToken) {
        clearToken();
        localStorage.removeItem('quiz_token');
        localStorage.removeItem('quiz_refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken ?? refreshToken;
        setToken(newAccessToken);
        localStorage.setItem('quiz_token', newAccessToken);
        localStorage.setItem('quiz_refresh_token', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        clearToken();
        localStorage.removeItem('quiz_token');
        localStorage.removeItem('quiz_refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;