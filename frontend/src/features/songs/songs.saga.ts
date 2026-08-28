import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { songsActions } from './songs.slice';
import { songsApi } from '../../api/songs.api';
import { extractErrorMessage } from '../../utils/error-handler';
import { ApiResponse, PaginationMeta } from '../../types/api';
import { Song } from '../../types/song';

function* fetchSongsSaga(action: ReturnType<typeof songsActions.fetchSongsRequest>) {
  try {
    const response: AxiosResponse<ApiResponse<Song[]>> = yield call(
      songsApi.getSongs,
      action.payload,
    );
    const pagination = response.data.meta?.pagination as PaginationMeta;
    yield put(
      songsActions.fetchSongsSuccess({
        items: response.data.data ?? [],
        pagination,
      }),
    );
  } catch (error) {
    yield put(songsActions.fetchSongsFailure(extractErrorMessage(error)));
  }
}

function* createSongSaga(action: ReturnType<typeof songsActions.createSongRequest>) {
  try {
    const response: AxiosResponse<ApiResponse<Song>> = yield call(
      songsApi.createSong,
      action.payload,
    );
    yield put(songsActions.createSongSuccess(response.data.data!));
  } catch (error) {
    yield put(songsActions.createSongFailure(extractErrorMessage(error)));
  }
}

function* updateSongSaga(action: ReturnType<typeof songsActions.updateSongRequest>) {
  try {
    const response: AxiosResponse<ApiResponse<Song>> = yield call(
      songsApi.updateSong,
      action.payload.id,
      action.payload.data,
    );
    yield put(songsActions.updateSongSuccess(response.data.data!));
  } catch (error) {
    yield put(songsActions.updateSongFailure(extractErrorMessage(error)));
  }
}

function* deleteSongSaga(action: ReturnType<typeof songsActions.deleteSongRequest>) {
  try {
    yield call(songsApi.deleteSong, action.payload);
    yield put(songsActions.deleteSongSuccess(action.payload));
  } catch (error) {
    yield put(songsActions.deleteSongFailure(extractErrorMessage(error)));
  }
}

export function* songsSaga() {
  yield takeLatest(songsActions.fetchSongsRequest.type, fetchSongsSaga);
  yield takeLatest(songsActions.createSongRequest.type, createSongSaga);
  yield takeLatest(songsActions.updateSongRequest.type, updateSongSaga);
  yield takeLatest(songsActions.deleteSongRequest.type, deleteSongSaga);
}
