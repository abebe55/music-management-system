import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/auth.saga';
import { songsSaga } from '../features/songs/songs.saga';
import { statisticsSaga } from '../features/statistics/statistics.saga';

export function* rootSaga() {
  yield all([authSaga(), songsSaga(), statisticsSaga()]);
}
