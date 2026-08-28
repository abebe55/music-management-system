import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatisticsState, Statistics } from '../../types/statistics';

const initialState: StatisticsState = {
  data: null,
  isLoading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    fetchStatisticsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatisticsSuccess: (state, action: PayloadAction<Statistics>) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const statisticsActions = statisticsSlice.actions;
export default statisticsSlice.reducer;
