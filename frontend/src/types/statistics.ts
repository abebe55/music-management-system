export interface GenreStat {
  genre: string;
  count: number;
}

export interface ArtistStat {
  artist: string;
  songCount: number;
  albumCount: number;
  albums: string[];
}

export interface AlbumStat {
  album: string;
  artist: string;
  songCount: number;
}

export interface Statistics {
  totals: {
    songs: number;
    artists: number;
    albums: number;
    genres: number;
  };
  byGenre: GenreStat[];
  byArtist: ArtistStat[];
  byAlbum: AlbumStat[];
  topArtists: ArtistStat[];
  topAlbums: AlbumStat[];
}

export interface StatisticsState {
  data: Statistics | null;
  isLoading: boolean;
  error: string | null;
}
