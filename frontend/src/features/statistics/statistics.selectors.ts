import { RootState } from '../../app/store';

export const selectStatistics = (state: RootState) => state.statistics.data;
export const selectStatisticsLoading = (state: RootState) => state.statistics.isLoading;
export const selectStatisticsError = (state: RootState) => state.statistics.error;
