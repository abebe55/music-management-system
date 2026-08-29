import { RootState } from '../../app/store';

export const selectSongs = (state: RootState) => state.songs;
export const selectSongItems = (state: RootState) => state.songs.items ?? [];
export const selectSongsLoading = (state: RootState) => state.songs.isLoading ?? false;
export const selectSongsError = (state: RootState) => state.songs.error ?? null;
export const selectSongsFilters = (state: RootState) => state.songs.filters ?? {};
export const selectSelectedSong = (state: RootState) => state.songs.selectedSong ?? null;
export const selectIsModalOpen = (state: RootState) => state.songs.isModalOpen ?? false;
export const selectModalMode = (state: RootState) => state.songs.modalMode ?? null;
export const selectDeleteConfirmId = (state: RootState) => state.songs.deleteConfirmId ?? null;
// Null-safe: old cached state may not have these fields yet
export const selectAllArtists = (state: RootState) => state.songs.allArtists ?? [];
export const selectAllAlbums = (state: RootState) => state.songs.allAlbums ?? [];
export const selectSongsPagination = (state: RootState) => ({
  total: state.songs.total ?? 0,
  page: state.songs.page ?? 1,
  limit: state.songs.limit ?? 8,
  totalPages: state.songs.totalPages ?? 0,
  hasNext: state.songs.hasNext ?? false,
  hasPrev: state.songs.hasPrev ?? false,
});
