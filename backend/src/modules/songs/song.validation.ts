import Joi from 'joi';
import { SongConstants } from '../../common/constants/song.constants';

const genreValues = SongConstants.GENRES as unknown as string[];

export const createSongSchema = Joi.object({
  title: Joi.string().trim().max(SongConstants.TITLE_MAX_LENGTH).required()
    .messages({ 'string.empty': 'Title is required' }),
  artist: Joi.string().trim().max(SongConstants.ARTIST_MAX_LENGTH).required()
    .pattern(/[A-Za-z]/, 'must contain letters')
    .messages({
      'string.empty': 'Artist is required',
      'string.pattern.name': 'Artist name must contain at least one letter (e.g. AC/DC, blink-182)',
    }),
  album: Joi.string().trim().max(SongConstants.ALBUM_MAX_LENGTH).required()
    .messages({ 'string.empty': 'Album is required' }),
  genre: Joi.string().valid(...genreValues).required()
    .messages({ 'any.only': 'Please select a valid genre' }),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().trim().max(SongConstants.TITLE_MAX_LENGTH).optional(),
  artist: Joi.string().trim().max(SongConstants.ARTIST_MAX_LENGTH).optional()
    .pattern(/[A-Za-z]/, 'must contain letters')
    .messages({
      'string.pattern.name': 'Artist name must contain at least one letter',
    }),
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
