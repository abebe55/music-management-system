import React, { useState, useEffect } from 'react';
import { Song, CreateSongRequest, UpdateSongRequest, GENRES } from '../../../types/song';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import { Form, FormActions } from './SongForm.styles';

// Predefined genre options for the dropdown
const genreOptions = GENRES.map((g) => ({ value: g, label: g }));

interface SongFormProps {
  mode: 'create' | 'edit';
  song?: Song | null;
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (data: CreateSongRequest | UpdateSongRequest) => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  artist: string;
  album: string;
  genreSelect: string;   // value in the dropdown (may be 'Other')
  genreCustom: string;   // text input shown when 'Other' is selected
}

interface FormErrors {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
}

/**
 * Determine the initial dropdown value and custom input value from
 * an existing song genre (used in edit mode).
 * If the saved genre is not in the predefined list it was a custom entry,
 * so select 'Other' and pre-fill the custom input.
 */
function splitGenre(genre: string): { genreSelect: string; genreCustom: string } {
  const isKnown = (GENRES as readonly string[]).includes(genre);
  if (!genre) return { genreSelect: '', genreCustom: '' };
  if (isKnown && genre !== 'Other') return { genreSelect: genre, genreCustom: '' };
  // Custom genre saved previously
  if (genre === 'Other') return { genreSelect: 'Other', genreCustom: '' };
  return { genreSelect: 'Other', genreCustom: genre };
}

export const SongForm: React.FC<SongFormProps> = ({
  mode, song, isLoading, error, onSubmit, onCancel,
}) => {
  const initialGenre = splitGenre(song?.genre ?? '');

  const [values, setValues] = useState<FormValues>({
    title:       song?.title  ?? '',
    artist:      song?.artist ?? '',
    album:       song?.album  ?? '',
    genreSelect: initialGenre.genreSelect,
    genreCustom: initialGenre.genreCustom,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (song) {
      const g = splitGenre(song.genre);
      setValues({
        title:       song.title,
        artist:      song.artist,
        album:       song.album,
        genreSelect: g.genreSelect,
        genreCustom: g.genreCustom,
      });
    }
  }, [song]);

  const isOther = values.genreSelect === 'Other';

  // The actual genre value that gets saved — custom text when 'Other'
  const resolvedGenre = isOther ? values.genreCustom.trim() : values.genreSelect;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!values.title.trim()) e.title = 'Title is required';
    if (!values.artist.trim()) {
      e.artist = 'Artist is required';
    } else if (!/[A-Za-z]/.test(values.artist)) {
      e.artist = 'Artist name must contain at least one letter (e.g. AC/DC, blink-182)';
    }
    if (!values.album.trim()) e.album = 'Album is required';
    if (!values.genreSelect) {
      e.genre = 'Genre is required';
    } else if (isOther) {
      if (!values.genreCustom.trim()) {
        e.genre = 'Please specify your genre';
      } else if (!/[A-Za-z]/.test(values.genreCustom)) {
        e.genre = 'Genre must contain at least one letter';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleField = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear genre error when either dropdown or custom field changes
    if (field === 'genreSelect' || field === 'genreCustom') {
      setErrors((prev) => ({ ...prev, genre: undefined }));
    } else if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title:  values.title.trim(),
      artist: values.artist.trim(),
      album:  values.album.trim(),
      // Store the actual genre string, not literally "Other"
      genre:  resolvedGenre as never,
    });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />

      <Input
        label="Title"
        required
        value={values.title}
        onChange={handleField('title')}
        error={errors.title}
        placeholder="Enter song title"
        maxLength={200}
        disabled={isLoading}
      />

      <Input
        label="Artist"
        required
        value={values.artist}
        onChange={handleField('artist')}
        error={errors.artist}
        placeholder="e.g. The Weeknd, AC/DC, blink-182"
        maxLength={150}
        disabled={isLoading}
        helperText="Must contain at least one letter"
      />

      <Input
        label="Album"
        required
        value={values.album}
        onChange={handleField('album')}
        error={errors.album}
        placeholder="Enter album name"
        maxLength={200}
        disabled={isLoading}
      />

      {/* Genre dropdown */}
      <Select
        label="Genre"
        required
        value={values.genreSelect}
        onChange={handleField('genreSelect')}
        options={genreOptions}
        placeholder="Select genre"
        error={!isOther ? errors.genre : undefined}
        disabled={isLoading}
      />

      {/* Custom genre input — shown only when "Other" is selected */}
      {isOther && (
        <Input
          label="Specify genre"
          required
          value={values.genreCustom}
          onChange={handleField('genreCustom')}
          error={errors.genre}
          placeholder="e.g. Ethiopian Traditional, Afrobeats"
          maxLength={100}
          disabled={isLoading}
          helperText="Enter your genre — it will be saved exactly as typed"
          autoFocus
        />
      )}

      <FormActions>
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Save Song' : 'Update Song'}
        </Button>
      </FormActions>
    </Form>
  );
};
