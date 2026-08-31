import React from 'react';
import { Song } from '../../../types/song';
import { formatDate } from '../../../utils/formatters';
import { GENRE_COLORS } from '../../../utils/constants';
import {
  TableWrapper, Table, THead, TBody, Th, Td, Tr, NumberCell,
  ActionCell, ActionButton, GenreBadge, DateText,
} from './SongTable.styles';

interface SongTableProps {
  songs: Song[];
  page: number;
  limit: number;
  onView: (song: Song) => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export const SongTable: React.FC<SongTableProps> = ({
  songs, page, limit, onView, onEdit, onDelete,
}) => (
  <TableWrapper>
    <Table aria-label="Songs list">
      <THead>
        <tr>
          <Th style={{ width: 40 }}>#</Th>
          <Th>Title</Th>
          <Th>Artist</Th>
          <Th>Album</Th>
          <Th>Genre</Th>
          <Th>Added On</Th>
          <Th style={{ textAlign: 'center' }}>Actions</Th>
        </tr>
      </THead>
      <TBody>
        {songs.map((song, idx) => (
          <Tr key={song.id}>
            <NumberCell>{(page - 1) * limit + idx + 1}</NumberCell>
            <Td style={{ fontWeight: 500, maxWidth: 200 }}>{song.title}</Td>
            <Td style={{ color: '#374151' }}>{song.artist}</Td>
            <Td style={{ color: '#6b7280', maxWidth: 160 }}>{song.album}</Td>
            <Td>
              <GenreBadge bg={GENRE_COLORS[song.genre] ? `${GENRE_COLORS[song.genre]}22` : undefined}>
                {song.genre}
              </GenreBadge>
            </Td>
            <Td>
              <DateText>{formatDate(song.createdAt)}</DateText>
            </Td>
            <ActionCell style={{ textAlign: 'center' }}>
              {/* View — now functional, opens detail modal */}
              <ActionButton
                aria-label={`View ${song.title}`}
                title="View details"
                onClick={() => onView(song)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </ActionButton>
              {/* Edit */}
              <ActionButton
                aria-label={`Edit ${song.title}`}
                title="Edit"
                onClick={() => onEdit(song)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </ActionButton>
              {/* Delete */}
              <ActionButton
                danger
                aria-label={`Delete ${song.title}`}
                title="Delete"
                onClick={() => onDelete(song.id)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </ActionButton>
            </ActionCell>
          </Tr>
        ))}
      </TBody>
    </Table>
  </TableWrapper>
);
