import client from './client';
import { Statistics } from '../types/statistics';
import { ApiResponse } from '../types/api';

export const statisticsApi = {
  getStatistics: () =>
    client.get<ApiResponse<Statistics>>('/statistics'),
};
