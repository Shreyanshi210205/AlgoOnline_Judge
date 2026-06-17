import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getStoredToken, setStoredToken, setStoredUser } from '../utils/storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      setStoredToken(null);
      setStoredUser(null);
      window.dispatchEvent(new Event('oj:logout'));
    }

    return Promise.reject(
      error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Request failed',
    );
  },
);
