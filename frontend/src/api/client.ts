import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/api.config';
import { storage } from '../utils/storage';

const client: AxiosInstance = axios.create(apiConfig);

// Request interceptor — attach access token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = storage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — handle 401 by clearing session
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clearAll();
      // Let the saga/redux handle the redirect by rejecting
    }
    return Promise.reject(error);
  },
);

export default client;
