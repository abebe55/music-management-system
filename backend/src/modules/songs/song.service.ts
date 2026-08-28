import { SongRepository } from './song.repository';
import { CreateSongDto, ISong, SongQueryDto, UpdateSongDto } from './song.types';
import { AppError } from '../../common/errors/app-error';
import { Messages } from '../../common/constants/messages';
import { ErrorCodes } from '../../common/errors/error-codes';
import { PaginatedResult } from '../../common/types/pagination';

export class SongService {
  private readonly repo: SongRepository;

  constructor() {
    this.repo = new SongRepository();
  }

  async createSong(dto: CreateSongDto): Promise<ISong> {
    return this.repo.create(dto);
  }

  async getSongs(query: SongQueryDto): Promise<PaginatedResult<ISong>> {
    return this.repo.findAll(query);
  }

  async getSongById(id: string): Promise<ISong> {
    const song = await this.repo.findById(id);
    if (!song) {
      throw AppError.notFound(Messages.songs.NOT_FOUND, ErrorCodes.SONG_NOT_FOUND);
    }
    return song;
  }

  async updateSong(id: string, dto: UpdateSongDto): Promise<ISong> {
    const song = await this.repo.update(id, dto);
    if (!song) {
      throw AppError.notFound(Messages.songs.NOT_FOUND, ErrorCodes.SONG_NOT_FOUND);
    }
    return song;
  }

  async deleteSong(id: string): Promise<void> {
    const song = await this.repo.delete(id);
    if (!song) {
      throw AppError.notFound(Messages.songs.NOT_FOUND, ErrorCodes.SONG_NOT_FOUND);
    }
  }
}
