import Joi from 'joi';
import { SongConstants } from '../../common/constants/song.constants';

const genreValues = SongConstants.GENRES as unknown as string[];

export const createSongSchema = Joi.object({
  title: Joi.string().trim().max(SongConstants.TITLE_MAX_LENGTH).required(),
  artist: Joi.string().trim().max(SongConstants.ARTIST_MAX_LENGTH).required(),
  album: Joi.string().trim().max(SongConstants.ALBUM_MAX_LENGTH).required(),
  genre: Joi.string().valid(...genreValues).required(),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().trim().max(SongConstants.TITLE_MAX_LENGTH).optional(),
  artist: Joi.string().trim().max(SongConstants.ARTIST_MAX_LENGTH).optional(),
  album: Joi.string().trim().max(SongConstants.ALBUM_MAX_LENGTH).optional(),
  genre: Joi.string().valid(...genreValues).optional(),
}).min(1);

export const songQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(SongConstants.MAX_PAGE_SIZE)
    .default(SongConstants.DEFAULT_PAGE_SIZE),
  sort: Joi.string()
    .valid('title', 'artist', 'album', 'genre', 'createdAt')
    .default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().trim().max(100).optional().allow(''),
  genre: Joi.string().optional().allow(''),
  artist: Joi.string().optional().allow(''),
  album: Joi.string().optional().allow(''),
});
