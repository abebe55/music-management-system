import React from 'react';
import styled from '@emotion/styled';
import { Song } from '../../../types/song';
import { Modal } from '../../common/Modal/Modal';
import { theme } from '../../../styles/theme';
import { GENRE_COLORS } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatters';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FieldLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const FieldValue = styled.span`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeights.medium};
`;

const GenreBadge = styled.span<{ bg?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: ${theme.radii.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ bg }) => bg ?? theme.colors.primaryLight};
  color: ${theme.colors.textPrimary};
  width: fit-content;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 4px 0;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  padding-top: 4px;
`;

interface SongDetailModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({ song, isOpen, onClose }) => {
  if (!song) return null;

  const genreColor = GENRE_COLORS[song.genre];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Song Details" maxWidth="440px">
      <Grid>
        <Field style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Title</FieldLabel>
          <FieldValue style={{ fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold }}>
            {song.title}
          </FieldValue>
        </Field>

        <Field>
          <FieldLabel>Artist</FieldLabel>
          <FieldValue>{song.artist}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Album</FieldLabel>
          <FieldValue>{song.album}</FieldValue>
        </Field>

        <Field style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Genre</FieldLabel>
          <GenreBadge bg={genreColor ? `${genreColor}22` : undefined}>
            {song.genre}
          </GenreBadge>
        </Field>
      </Grid>

      <Divider style={{ marginTop: 16 }} />

      <MetaRow>
        <span>Added: {formatDate(song.createdAt)}</span>
        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
          ID: {song.id.slice(0, 12)}…
        </span>
      </MetaRow>
    </Modal>
  );
};
