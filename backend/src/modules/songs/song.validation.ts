import Joi from 'joi';
import { SongConstants } from '../../common/constants/song.constants';

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
  // Accept predefined genres OR any custom text (when user selects "Other")
  // Must contain at least one letter to prevent numeric-only genre names
  genre: Joi.string().trim().max(100).required()
    .pattern(/[A-Za-z]/, 'must contain letters')
    .messages({
      'string.empty': 'Genre is required',
      'string.pattern.name': 'Genre must contain at least one letter',
    }),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().trim().max(SongConstants.TITLE_MAX_LENGTH).optional(),
  artist: Joi.string().trim().max(SongConstants.ARTIST_MAX_LENGTH).optional()
    .pattern(/[A-Za-z]/, 'must contain letters')
    .messages({
      'string.pattern.name': 'Artist name must contain at least one letter',
    }),
  album: Joi.string().trim().max(SongConstants.ALBUM_MAX_LENGTH).optional(),
  genre: Joi.string().trim().max(100).optional()
    .pattern(/[A-Za-z]/, 'must contain letters')
    .messages({
      'string.pattern.name': 'Genre must contain at least one letter',
    }),
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
