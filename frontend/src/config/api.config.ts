import { env } from './env';

export const apiConfig = {
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
