import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

export const setToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};

export default api;
