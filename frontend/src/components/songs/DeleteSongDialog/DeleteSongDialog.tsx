import React from 'react';
import { ConfirmDialog } from '../../common/ConfirmDialog/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { songsActions } from '../../../features/songs/songs.slice';
import {
  selectDeleteConfirmId, selectSongItems, selectSongsLoading,
} from '../../../features/songs/songs.selectors';

export const DeleteSongDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteId = useAppSelector(selectDeleteConfirmId);
  const songs = useAppSelector(selectSongItems);
  const isLoading = useAppSelector(selectSongsLoading);

  const song = songs.find((s) => s.id === deleteId);

  const handleClose = () => dispatch(songsActions.setDeleteConfirmId(null));
  const handleConfirm = () => {
    if (deleteId) dispatch(songsActions.deleteSongRequest(deleteId));
  };

  return (
    <ConfirmDialog
      isOpen={!!deleteId}
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      itemName={song?.title}
    />
  );
};
