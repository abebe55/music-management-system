import { StatisticsService } from '../../../src/modules/statistics/statistics.service';
import { StatisticsRepository } from '../../../src/modules/statistics/statistics.repository';

jest.mock('../../../src/modules/statistics/statistics.repository');

const MockedStatisticsRepository = StatisticsRepository as jest.MockedClass<typeof StatisticsRepository>;

describe('StatisticsService', () => {
  let service: StatisticsService;
  let repoMock: jest.Mocked<StatisticsRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new StatisticsService();
    repoMock = MockedStatisticsRepository.mock.instances[0] as jest.Mocked<StatisticsRepository>;
  });

  it('should return aggregated statistics', async () => {
    repoMock.getTotals.mockResolvedValue({ songs: 10, artists: 5, albums: 8, genres: 3 });
    repoMock.getSongsByGenre.mockResolvedValue([
      { genre: 'Pop', count: 5 },
      { genre: 'Rock', count: 3 },
      { genre: 'Hip Hop', count: 2 },
    ]);
    repoMock.getSongsByArtist.mockResolvedValue([
      { artist: 'The Weeknd', songCount: 4, albumCount: 2, albums: ['After Hours', 'Starboy'] },
    ]);
    repoMock.getSongsByAlbum.mockResolvedValue([
      { album: 'After Hours', artist: 'The Weeknd', songCount: 3 },
    ]);

    const result = await service.getStatistics();

    expect(result.totals.songs).toBe(10);
    expect(result.totals.artists).toBe(5);
    expect(result.byGenre).toHaveLength(3);
    expect(result.byArtist).toHaveLength(1);
    expect(result.byAlbum).toHaveLength(1);
    expect(result.topArtists).toHaveLength(1);
    expect(result.topAlbums).toHaveLength(1);
  });

  it('should return top 5 artists and albums', async () => {
    const artists = Array.from({ length: 8 }, (_, i) => ({
      artist: `Artist ${i + 1}`,
      songCount: 10 - i,
      albumCount: 2,
      albums: [],
    }));

    repoMock.getTotals.mockResolvedValue({ songs: 50, artists: 8, albums: 16, genres: 4 });
    repoMock.getSongsByGenre.mockResolvedValue([]);
    repoMock.getSongsByArtist.mockResolvedValue(artists);
    repoMock.getSongsByAlbum.mockResolvedValue([]);

    const result = await service.getStatistics();

    expect(result.topArtists).toHaveLength(5);
    expect(result.topArtists[0].artist).toBe('Artist 1');
  });
});
