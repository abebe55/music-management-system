import client from './client';
import { Song, CreateSongRequest, UpdateSongRequest, SongQuery } from '../types/song';
import { ApiResponse, PaginationMeta } from '../types/api';

export const songsApi = {
  getSongs: (params: SongQuery) =>
    client.get<ApiResponse<Song[]>>('/songs', { params }),

  getSongById: (id: string) =>
    client.get<ApiResponse<Song>>(`/songs/${id}`),

  createSong: (data: CreateSongRequest) =>
    client.post<ApiResponse<Song>>('/songs', data),

  updateSong: (id: string, data: UpdateSongRequest) =>
    client.put<ApiResponse<Song>>(`/songs/${id}`, data),

  deleteSong: (id: string) =>
    client.delete<ApiResponse<null>>(`/songs/${id}`),
};

export type SongsListResponse = {
  data: Song[];
  pagination: PaginationMeta;
};
