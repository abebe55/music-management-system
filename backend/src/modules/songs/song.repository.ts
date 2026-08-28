import { FilterQuery } from 'mongoose';
import { SongModel } from './song.model';
import { ISong, SongQueryDto, CreateSongDto, UpdateSongDto } from './song.types';
import { normalizePagination, buildPaginatedResult } from '../../common/utils/pagination';
import { PaginatedResult } from '../../common/types/pagination';

export class SongRepository {
  async create(dto: CreateSongDto): Promise<ISong> {
    const song = await SongModel.create(dto);
    return song.toObject() as ISong;
  }

  async findById(id: string): Promise<ISong | null> {
    return SongModel.findById(id).lean<ISong>().exec();
  }

  async update(id: string, dto: UpdateSongDto): Promise<ISong | null> {
    return SongModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .lean<ISong>()
      .exec();
  }

  async delete(id: string): Promise<ISong | null> {
    return SongModel.findByIdAndDelete(id).lean<ISong>().exec();
  }

  async findAll(query: SongQueryDto): Promise<PaginatedResult<ISong>> {
    const { page, limit, skip, sort, order } = normalizePagination(query);
    const filter = this.buildFilter(query);

    const [data, total] = await Promise.all([
      SongModel.find(filter)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .lean<ISong[]>()
        .exec(),
      SongModel.countDocuments(filter),
    ]);

    return buildPaginatedResult(data, total, page, limit);
  }

  async countAll(): Promise<number> {
    return SongModel.countDocuments();
  }

  private buildFilter(query: SongQueryDto): FilterQuery<ISong> {
    const filter: FilterQuery<ISong> = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { artist: { $regex: query.search, $options: 'i' } },
        { album: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.genre) {
      filter.genre = query.genre;
    }

    if (query.artist) {
      filter.artist = { $regex: query.artist, $options: 'i' };
    }

    if (query.album) {
      filter.album = { $regex: query.album, $options: 'i' };
    }

    return filter;
  }
}
