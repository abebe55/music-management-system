import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import songsReducer from '../features/songs/songs.slice';
import statisticsReducer from '../features/statistics/statistics.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  songs: songsReducer,
  statistics: statisticsReducer,
});
