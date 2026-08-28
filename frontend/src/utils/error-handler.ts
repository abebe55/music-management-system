import { AxiosError } from 'axios';
import { ApiResponse } from '../types/api';

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) return data.message;
    if (data?.error?.details && Array.isArray(data.error.details)) {
      return data.error.details.map((d) => d.message).join(', ');
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
