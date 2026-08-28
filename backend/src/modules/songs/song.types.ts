import { Document } from 'mongoose';
import { Genre } from '../../common/constants/song.constants';

export interface ISong extends Document {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: Genre;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSongDto {
  title: string;
  artist: string;
  album: string;
  genre: Genre;
}

export interface UpdateSongDto {
  title?: string;
  artist?: string;
  album?: string;
  genre?: Genre;
}

export interface SongQueryDto {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
  album?: string;
}
