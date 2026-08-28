import { StatisticsRepository } from './statistics.repository';
import { Statistics } from './statistics.types';

export class StatisticsService {
  private readonly repo: StatisticsRepository;

  constructor() {
    this.repo = new StatisticsRepository();
  }

  async getStatistics(): Promise<Statistics> {
    const [totals, byGenre, byArtist, byAlbum] = await Promise.all([
      this.repo.getTotals(),
      this.repo.getSongsByGenre(),
      this.repo.getSongsByArtist(),
      this.repo.getSongsByAlbum(),
    ]);

    return {
      totals,
      byGenre,
      byArtist,
      byAlbum,
      topArtists: byArtist.slice(0, 5),
      topAlbums: byAlbum.slice(0, 5),
    };
  }
}
