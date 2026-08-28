import { SongModel } from '../songs/song.model';
import { GenreStat, ArtistStat, AlbumStat } from './statistics.types';

export class StatisticsRepository {
  async getTotals(): Promise<{
    songs: number;
    artists: number;
    albums: number;
    genres: number;
  }> {
    const [songs, artistsResult, albumsResult, genresResult] = await Promise.all([
      SongModel.countDocuments(),
      SongModel.distinct('artist'),
      SongModel.distinct('album'),
      SongModel.distinct('genre'),
    ]);

    return {
      songs,
      artists: artistsResult.length,
      albums: albumsResult.length,
      genres: genresResult.length,
    };
  }

  async getSongsByGenre(): Promise<GenreStat[]> {
    return SongModel.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $project: { _id: 0, genre: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  }

  async getSongsByArtist(): Promise<ArtistStat[]> {
    return SongModel.aggregate([
      {
        $group: {
          _id: '$artist',
          songCount: { $sum: 1 },
          albums: { $addToSet: '$album' },
        },
      },
      {
        $project: {
          _id: 0,
          artist: '$_id',
          songCount: 1,
          albums: 1,
          albumCount: { $size: '$albums' },
        },
      },
      { $sort: { songCount: -1 } },
    ]);
  }

  async getSongsByAlbum(): Promise<AlbumStat[]> {
    return SongModel.aggregate([
      {
        $group: {
          _id: { album: '$album', artist: '$artist' },
          songCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          album: '$_id.album',
          artist: '$_id.artist',
          songCount: 1,
        },
      },
      { $sort: { songCount: -1 } },
    ]);
  }
}
