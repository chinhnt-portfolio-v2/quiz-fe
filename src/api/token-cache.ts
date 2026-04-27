let tokenCache: string | null = null;

export const setToken = (t: string) => {
  tokenCache = t;
};

export const getToken = () => tokenCache;

export const clearToken = () => {
  tokenCache = null;
};