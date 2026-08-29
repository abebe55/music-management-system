import { RootState } from '../../app/store';

export const selectSongs = (state: RootState) => state.songs;
export const selectSongItems = (state: RootState) => state.songs.items;
export const selectSongsLoading = (state: RootState) => state.songs.isLoading;
export const selectSongsError = (state: RootState) => state.songs.error;
export const selectSongsFilters = (state: RootState) => state.songs.filters;
export const selectSelectedSong = (state: RootState) => state.songs.selectedSong;
export const selectIsModalOpen = (state: RootState) => state.songs.isModalOpen;
export const selectModalMode = (state: RootState) => state.songs.modalMode;
export const selectDeleteConfirmId = (state: RootState) => state.songs.deleteConfirmId;
export const selectAllArtists = (state: RootState) => state.songs.allArtists;
export const selectAllAlbums = (state: RootState) => state.songs.allAlbums;
export const selectSongsPagination = (state: RootState) => ({
  total: state.songs.total,
  page: state.songs.page,
  limit: state.songs.limit,
  totalPages: state.songs.totalPages,
  hasNext: state.songs.hasNext,
  hasPrev: state.songs.hasPrev,
});
