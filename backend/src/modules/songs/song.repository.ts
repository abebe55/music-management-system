import { FilterQuery } from 'mongoose';
import { SongModel } from './song.model';
import { ISong, SongQueryDto, CreateSongDto, UpdateSongDto } from './song.types';
import { normalizePagination, buildPaginatedResult } from '../../common/utils/pagination';
import { PaginatedResult } from '../../common/types/pagination';

/**
 * Apply the schema's toJSON transform to a raw Mongoose document or
 * plain object so that _id is mapped to id and __v is stripped.
 * This is needed for lean() results which skip the transform.
 */
function applyTransform(doc: Record<string, unknown>): ISong {
  const result: Record<string, unknown> = { ...doc };
  if (result['_id'] !== undefined) {
    result['id'] = String(result['_id']);
    delete result['_id'];
  }
  delete result['__v'];
  return result as unknown as ISong;
}

function applyTransformList(docs: Record<string, unknown>[]): ISong[] {
  return docs.map(applyTransform);
}

export class SongRepository {
  async create(dto: CreateSongDto): Promise<ISong> {
    const song = await SongModel.create(dto);
    // toJSON() applies the schema transform (maps _id → id)
    return song.toJSON() as unknown as ISong;
  }

  async findById(id: string): Promise<ISong | null> {
    const doc = await SongModel.findById(id).lean<Record<string, unknown>>().exec();
    return doc ? applyTransform(doc) : null;
  }

  async update(id: string, dto: UpdateSongDto): Promise<ISong | null> {
    const doc = await SongModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    )
      .lean<Record<string, unknown>>()
      .exec();
    return doc ? applyTransform(doc) : null;
  }

  async delete(id: string): Promise<ISong | null> {
    const doc = await SongModel.findByIdAndDelete(id)
      .lean<Record<string, unknown>>()
      .exec();
    return doc ? applyTransform(doc) : null;
  }

  async findAll(query: SongQueryDto): Promise<PaginatedResult<ISong>> {
    const { page, limit, skip, sort, order } = normalizePagination(query);
    const filter = this.buildFilter(query);

    const [rawDocs, total] = await Promise.all([
      SongModel.find(filter)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .lean<Record<string, unknown>[]>()
        .exec(),
      SongModel.countDocuments(filter),
    ]);

    const data = applyTransformList(rawDocs);
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
