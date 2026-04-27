import api from './quiz-api';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    api.post('/auth/register', payload).then(r => r.data),

  logout: () => api.post('/auth/logout').then(r => r.data),

  me: () => api.get('/auth/me').then(r => r.data),
};

export function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('quiz_token', accessToken);
  localStorage.setItem('quiz_refresh_token', refreshToken);
  import('./token-cache').then(m => m.setToken(accessToken));
}

export function clearTokens() {
  localStorage.removeItem('quiz_token');
  localStorage.removeItem('quiz_refresh_token');
  import('./token-cache').then(m => m.clearToken());
}
