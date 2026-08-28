export const GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Country',
  'Electronic', 'Alternative', 'Indie', 'Metal', 'Blues', 'Reggae',
  'Soul', 'Latin', 'Folk', 'Punk', 'Disco', 'Other',
] as const;

export type Genre = (typeof GENRES)[number];

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: Genre;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongRequest {
  title: string;
  artist: string;
  album: string;
  genre: Genre;
}

export interface UpdateSongRequest {
  title?: string;
  artist?: string;
  album?: string;
  genre?: Genre;
}

export interface SongQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
  album?: string;
}

export interface SongsState {
  items: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  error: string | null;
  filters: SongQuery;
  selectedSong: Song | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | null;
  deleteConfirmId: string | null;
}
