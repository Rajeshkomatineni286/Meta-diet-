import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://metadiet-backend.onrender.com').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API ERROR:', {
      baseURL: API_BASE_URL,
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    return Promise.reject(error);
  }
);

export default api;
