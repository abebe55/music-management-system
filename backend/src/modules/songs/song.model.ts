import mongoose, { Schema } from 'mongoose';
import { ISong } from './song.types';
import { SongConstants } from '../../common/constants/song.constants';

const songSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: SongConstants.TITLE_MAX_LENGTH,
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
      maxlength: SongConstants.ARTIST_MAX_LENGTH,
    },
    album: {
      type: String,
      required: [true, 'Album is required'],
      trim: true,
      maxlength: SongConstants.ALBUM_MAX_LENGTH,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      maxlength: [100, 'Genre must be 100 characters or less'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = (ret['_id'] as { toString(): string }).toString();
        delete ret['_id'];
        return ret;
      },
    },
  },
);

// Text search index
songSchema.index({ title: 'text', artist: 'text', album: 'text' });
// Unique composite index — prevents exact duplicate title+artist+album
// (case-insensitive collation so "Shape of You" == "shape of you")
songSchema.index(
  { title: 1, artist: 1, album: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
    name: 'unique_song_title_artist_album',
  },
);
// Filter indexes
songSchema.index({ genre: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ album: 1 });
songSchema.index({ createdAt: -1 });

export const SongModel = mongoose.model<ISong>('Song', songSchema);
