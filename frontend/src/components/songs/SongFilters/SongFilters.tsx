import React from 'react';
import { GENRES } from '../../../types/song';
import {
  FiltersWrapper, SearchBox, SearchInput, FilterSelect, ClearButton,
} from './SongFilters.styles';

interface SongFiltersProps {
  search: string;
  genre: string;
  artist: string;
  album: string;
  artists: string[];
  albums: string[];
  onSearchChange: (v: string) => void;
  onGenreChange: (v: string) => void;
  onArtistChange: (v: string) => void;
  onAlbumChange: (v: string) => void;
  onClear: () => void;
}

export const SongFilters: React.FC<SongFiltersProps> = ({
  search, genre, artist, album,
  artists, albums,
  onSearchChange, onGenreChange, onArtistChange, onAlbumChange, onClear,
}) => {
  const hasFilters = !!(search || genre || artist || album);

  return (
    <FiltersWrapper>
      {/* Search */}
      <SearchBox>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <SearchInput
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search songs"
        />
      </SearchBox>

      {/* Genre filter */}
      <FilterSelect
        value={genre}
        onChange={(e) => onGenreChange(e.target.value)}
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
      </FilterSelect>

      {/* Artist filter — dynamic */}
      <FilterSelect
        value={artist}
        onChange={(e) => onArtistChange(e.target.value)}
        aria-label="Filter by artist"
        style={{ minWidth: 130 }}
      >
        <option value="">All Artists</option>
        {artists.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </FilterSelect>

      {/* Album filter — dynamic */}
      <FilterSelect
        value={album}
        onChange={(e) => onAlbumChange(e.target.value)}
        aria-label="Filter by album"
        style={{ minWidth: 130 }}
      >
        <option value="">All Albums</option>
        {albums.map((al) => (
          <option key={al} value={al}>{al}</option>
        ))}
      </FilterSelect>

      {hasFilters && (
        <ClearButton onClick={onClear} type="button">
          Clear
        </ClearButton>
      )}
    </FiltersWrapper>
  );
};
