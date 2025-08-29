import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

export const httpService = axios.create({
  baseURL: '/api',
  // baseURL: baseURL || 'https://spotify-music.liara.run/',

});
httpService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
