import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongsState, SongQuery, CreateSongRequest, UpdateSongRequest } from '../../types/song';
import { PaginationMeta } from '../../types/api';

const initialState: SongsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 8,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 8, sort: 'createdAt', order: 'desc' },
  selectedSong: null,
  isModalOpen: false,
  modalMode: null,
  deleteConfirmId: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch list
    fetchSongsRequest: (state, action: PayloadAction<SongQuery>) => {
      state.isLoading = true;
      state.error = null;
      state.filters = { ...state.filters, ...action.payload };
    },
    fetchSongsSuccess: (
      state,
      action: PayloadAction<{ items: Song[]; pagination: PaginationMeta }>,
    ) => {
      state.isLoading = false;
      state.items = action.payload.items;
      const p = action.payload.pagination;
      state.total = p.total;
      state.page = p.page;
      state.limit = p.limit;
      state.totalPages = p.totalPages;
      state.hasNext = p.hasNext;
      state.hasPrev = p.hasPrev;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create
    createSongRequest: (state, _action: PayloadAction<CreateSongRequest>) => {
      state.isLoading = true;
      state.error = null;
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.isLoading = false;
      state.isModalOpen = false;
      state.modalMode = null;
      // Prepend to list if on page 1
      if (state.page === 1) {
        state.items = [action.payload, ...state.items.slice(0, state.limit - 1)];
        state.total += 1;
      }
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update
    updateSongRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateSongRequest }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.isLoading = false;
      state.isModalOpen = false;
      state.modalMode = null;
      state.selectedSong = null;
      state.items = state.items.map((s) =>
        s.id === action.payload.id ? action.payload : s,
      );
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete
    deleteSongRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteConfirmId = null;
      state.items = state.items.filter((s) => s.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // UI
    openCreateModal: (state) => {
      state.isModalOpen = true;
      state.modalMode = 'create';
      state.selectedSong = null;
      state.error = null;
    },
    openEditModal: (state, action: PayloadAction<Song>) => {
      state.isModalOpen = true;
      state.modalMode = 'edit';
      state.selectedSong = action.payload;
      state.error = null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalMode = null;
      state.selectedSong = null;
      state.error = null;
    },
    setDeleteConfirmId: (state, action: PayloadAction<string | null>) => {
      state.deleteConfirmId = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SongQuery>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearError: (state) => { state.error = null; },
  },
});

export const songsActions = songsSlice.actions;
export default songsSlice.reducer;
