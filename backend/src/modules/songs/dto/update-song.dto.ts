import { Genre } from '../../../common/constants/song.constants';

export interface UpdateSongDto {
  title?: string;
  artist?: string;
  album?: string;
  genre?: Genre;
}
