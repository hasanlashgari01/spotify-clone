import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL || 'https://spotify-music.liara.run';

export const httpService = axios.create({
  baseURL: baseURL || 'https://spotify-music.liara.run/',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add auth token
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

// Response interceptor to handle token expiration
httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('accessToken');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const publicService = axios.create({
  baseURL,
});

publicService.interceptors.request.use(
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