import { ISong } from '../../src/modules/songs/song.types';

export const mockSong = (overrides: Partial<ISong> = {}): ISong =>
  ({
    _id: 'song-id-123',
    id: 'song-id-123',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    genre: 'Pop',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as unknown as ISong);

export const validCreateSongPayload = {
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  genre: 'Pop',
};

export const validUpdateSongPayload = {
  title: 'Save Your Tears',
  album: 'After Hours (Deluxe)',
};

export const mockSongList = (): ISong[] => [
  mockSong({ _id: 'song-1', id: 'song-1', title: 'Blinding Lights', genre: 'Pop' }),
  mockSong({ _id: 'song-2', id: 'song-2', title: 'Starboy', genre: 'Pop' }),
  mockSong({ _id: 'song-3', id: 'song-3', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock' }),
] as unknown as ISong[];
