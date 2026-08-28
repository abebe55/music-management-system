import React, { useState, useEffect } from 'react';
import { Song, CreateSongRequest, UpdateSongRequest, GENRES, Genre } from '../../../types/song';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import { Form, FormActions } from './SongForm.styles';

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
  genre: string;
}

interface FormErrors {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
}

export const SongForm: React.FC<SongFormProps> = ({
  mode, song, isLoading, error, onSubmit, onCancel,
}) => {
  const [values, setValues] = useState<FormValues>({
    title: song?.title ?? '',
    artist: song?.artist ?? '',
    album: song?.album ?? '',
    genre: song?.genre ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (song) {
      setValues({ title: song.title, artist: song.artist, album: song.album, genre: song.genre });
    }
  }, [song]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!values.title.trim()) newErrors.title = 'Title is required';
    if (!values.artist.trim()) newErrors.artist = 'Artist is required';
    if (!values.album.trim()) newErrors.album = 'Album is required';
    if (!values.genre) newErrors.genre = 'Genre is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: values.title.trim(),
      artist: values.artist.trim(),
      album: values.album.trim(),
      genre: values.genre as Genre,
    });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />

      <Input
        label="Title"
        required
        value={values.title}
        onChange={handleChange('title')}
        error={errors.title}
        placeholder="Enter song title"
        maxLength={200}
        disabled={isLoading}
      />
      <Input
        label="Artist"
        required
        value={values.artist}
        onChange={handleChange('artist')}
        error={errors.artist}
        placeholder="Enter artist name"
        maxLength={150}
        disabled={isLoading}
      />
      <Input
        label="Album"
        required
        value={values.album}
        onChange={handleChange('album')}
        error={errors.album}
        placeholder="Enter album name"
        maxLength={200}
        disabled={isLoading}
      />
      <Select
        label="Genre"
        required
        value={values.genre}
        onChange={handleChange('genre')}
        options={genreOptions}
        placeholder="Select genre"
        error={errors.genre}
        disabled={isLoading}
      />

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
