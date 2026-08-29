import React, { useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { songsActions } from '../../features/songs/songs.slice';
import {
  selectSongItems, selectSongsLoading, selectSongsError,
  selectSongsFilters, selectSongsPagination, selectIsModalOpen,
  selectModalMode, selectSelectedSong, selectAllArtists, selectAllAlbums,
} from '../../features/songs/songs.selectors';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { SongTable } from '../../components/songs/SongTable/SongTable';
import { SongFilters } from '../../components/songs/SongFilters/SongFilters';
import { DeleteSongDialog } from '../../components/songs/DeleteSongDialog/DeleteSongDialog';
import { Modal } from '../../components/common/Modal/Modal';
import { SongForm } from '../../components/songs/SongForm/SongForm';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { Button } from '../../components/common/Button/Button';
import { Spinner } from '../../components/common/Spinner/Spinner';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { theme } from '../../styles/theme';
import { Song, CreateSongRequest, UpdateSongRequest, SongQuery } from '../../types/song';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  margin-top: 2px;
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadows.card};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const CardBody = styled.div`
  padding: 0;
`;

const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${theme.colors.border};
`;

const SongsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongItems);
  const isLoading = useAppSelector(selectSongsLoading);
  const error = useAppSelector(selectSongsError);
  const filters = useAppSelector(selectSongsFilters);
  const pagination = useAppSelector(selectSongsPagination);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const modalMode = useAppSelector(selectModalMode);
  const selectedSong = useAppSelector(selectSelectedSong);
  const allArtists = useAppSelector(selectAllArtists);
  const allAlbums = useAppSelector(selectAllAlbums);

  // ── Serialize filters to a stable string so we only fetch when
  //    the actual filter *values* change, not the object reference.
  //    fetchSongsRequest overwrites state.filters which would create
  //    a new object reference on every dispatch → infinite loop.
  const filtersKey = JSON.stringify({
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
    order: filters.order,
    search: filters.search ?? '',
    genre: filters.genre ?? '',
    artist: filters.artist ?? '',
    album: filters.album ?? '',
  });

  // Track the previous key to avoid dispatching when the reducer
  // echoes back the same values in a new object.
  const prevFiltersKeyRef = useRef<string>('');

  useEffect(() => {
    if (filtersKey === prevFiltersKeyRef.current) return;
    prevFiltersKeyRef.current = filtersKey;
    // Parse back so we pass a clean object (not the serialized string)
    dispatch(songsActions.fetchSongsRequest(JSON.parse(filtersKey) as SongQuery));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  // Load filter dropdown options once on mount
  useEffect(() => {
    dispatch(songsActions.fetchFilterOptionsRequest());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useCallback(
    (v: string) => dispatch(songsActions.setFilters({ search: v })),
    [dispatch],
  );
  const handleGenreChange = useCallback(
    (v: string) => dispatch(songsActions.setFilters({ genre: v })),
    [dispatch],
  );
  const handleArtistChange = useCallback(
    (v: string) => dispatch(songsActions.setFilters({ artist: v })),
    [dispatch],
  );
  const handleAlbumChange = useCallback(
    (v: string) => dispatch(songsActions.setFilters({ album: v })),
    [dispatch],
  );
  const handleClearFilters = useCallback(() => {
    dispatch(songsActions.setFilters({ search: '', genre: '', artist: '', album: '' }));
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(songsActions.setFilters({ page }));
  }, [dispatch]);

  const handleLimitChange = useCallback((limit: number) => {
    // Reset to page 1 when rows-per-page changes
    dispatch(songsActions.setFilters({ limit, page: 1 }));
  }, [dispatch]);

  const handleEdit = useCallback(
    (song: Song) => dispatch(songsActions.openEditModal(song)),
    [dispatch],
  );
  const handleDelete = useCallback(
    (id: string) => dispatch(songsActions.setDeleteConfirmId(id)),
    [dispatch],
  );
  const handleCloseModal = useCallback(
    () => dispatch(songsActions.closeModal()),
    [dispatch],
  );

  const handleSubmit = useCallback((data: CreateSongRequest | UpdateSongRequest) => {
    if (modalMode === 'create') {
      dispatch(songsActions.createSongRequest(data as CreateSongRequest));
    } else if (modalMode === 'edit' && selectedSong) {
      dispatch(songsActions.updateSongRequest({ id: selectedSong.id, data }));
    }
  }, [dispatch, modalMode, selectedSong]);

  return (
    <MainLayout>
      <PageHeader>
        <div>
          <PageTitle>Songs</PageTitle>
          <PageSubtitle>Manage your songs</PageSubtitle>
        </div>
        <Button
          leftIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
          onClick={() => dispatch(songsActions.openCreateModal())}
        >
          Add Song
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <SongFilters
            search={filters.search ?? ''}
            genre={filters.genre ?? ''}
            artist={filters.artist ?? ''}
            album={filters.album ?? ''}
            artists={allArtists}
            albums={allAlbums}
            onSearchChange={handleSearchChange}
            onGenreChange={handleGenreChange}
            onArtistChange={handleArtistChange}
            onAlbumChange={handleAlbumChange}
            onClear={handleClearFilters}
          />
        </CardHeader>

        <CardBody>
          {isLoading && <Spinner centered />}

          {!isLoading && error && (
            <ErrorState
              message={error}
              onRetry={() => dispatch(songsActions.fetchSongsRequest(JSON.parse(filtersKey) as SongQuery))}
            />
          )}

          {!isLoading && !error && songs.length === 0 && (
            <EmptyState
              title="No songs found"
              description="Try adjusting your filters or add a new song."
              action={
                <Button onClick={() => dispatch(songsActions.openCreateModal())}>
                  Add your first song
                </Button>
              }
            />
          )}

          {!isLoading && !error && songs.length > 0 && (
            <SongTable
              songs={songs}
              page={pagination.page}
              limit={pagination.limit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardBody>

        {songs.length > 0 && (
          <CardFooter>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </CardFooter>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'Add New Song' : 'Edit Song'}
      >
        <SongForm
          mode={modalMode ?? 'create'}
          song={selectedSong}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation */}
      <DeleteSongDialog />
    </MainLayout>
  );
};

export default SongsPage;
