import axios from 'axios';
import { API_URL } from '../config';

// Cria instância do axios com configuração base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para adicionar token automaticamente em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Adiciona token do localStorage se existir
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se receber 401, remove token e redireciona para login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

