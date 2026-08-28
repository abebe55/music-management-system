import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { statisticsActions } from './statistics.slice';
import { statisticsApi } from '../../api/statistics.api';
import { extractErrorMessage } from '../../utils/error-handler';
import { ApiResponse } from '../../types/api';
import { Statistics } from '../../types/statistics';

function* fetchStatisticsSaga() {
  try {
    const response: AxiosResponse<ApiResponse<Statistics>> = yield call(
      statisticsApi.getStatistics,
    );
    yield put(statisticsActions.fetchStatisticsSuccess(response.data.data!));
  } catch (error) {
    yield put(statisticsActions.fetchStatisticsFailure(extractErrorMessage(error)));
  }
}

export function* statisticsSaga() {
  yield takeLatest(statisticsActions.fetchStatisticsRequest.type, fetchStatisticsSaga);
}
