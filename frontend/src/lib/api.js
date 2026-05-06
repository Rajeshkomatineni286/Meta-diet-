import axios from 'axios';

const fallbackBase = 'https://metadiet-backend.onrender.com';
const rawBase = (import.meta.env.VITE_API_URL || fallbackBase).replace(/\/$/, '');
const baseURL = rawBase.endsWith('/api/v1') ? rawBase : `${rawBase}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const networkError = !error?.response;
    console.error('API Error:', {
      baseURL,
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
      message: networkError ? 'Network error/CORS blocked or backend unreachable' : error?.message,
    });
    return Promise.reject(error);
  }
);

export default api;
