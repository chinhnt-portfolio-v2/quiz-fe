import axios from 'axios';
import { setToken, getToken, clearToken } from './token-cache';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://chinhnt-portfolio-platform.fly.dev/api/v1',
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
    if (err.response?.status === 401 && !originalRequest._retry) {
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