import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://portfolio-platform-1095331155372.asia-southeast1.run.app/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wallet_token') || localStorage.getItem('quiz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wallet_token');
      localStorage.removeItem('wallet_refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;