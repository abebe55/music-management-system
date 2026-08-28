import { Request, Response } from 'express';
import { SongService } from './song.service';
import { sendSuccess } from '../../common/utils/response';
import { Messages } from '../../common/constants/messages';
import { HttpStatus } from '../../common/constants/http-status';
import { CreateSongDto, UpdateSongDto, SongQueryDto } from './song.types';
import { PaginationMeta } from '../../common/types/api-response';
import { PaginatedResult } from '../../common/types/pagination';
import { ISong } from './song.types';

const songService = new SongService();

function toPaginationMeta(result: PaginatedResult<ISong>): PaginationMeta {
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    hasNext: result.hasNext,
    hasPrev: result.hasPrev,
  };
}

export async function createSong(req: Request, res: Response): Promise<void> {
  const dto = req.body as CreateSongDto;
  const song = await songService.createSong(dto);
  sendSuccess(res, song, Messages.songs.CREATED, HttpStatus.CREATED);
}

export async function getSongs(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as SongQueryDto;
  const result = await songService.getSongs(query);
  sendSuccess(res, result.data, Messages.songs.FETCHED, HttpStatus.OK, toPaginationMeta(result));
}

export async function getSongById(req: Request, res: Response): Promise<void> {
  const song = await songService.getSongById(req.params.id);
  sendSuccess(res, song, Messages.songs.FETCH_ONE);
}

export async function updateSong(req: Request, res: Response): Promise<void> {
  const dto = req.body as UpdateSongDto;
  const song = await songService.updateSong(req.params.id, dto);
  sendSuccess(res, song, Messages.songs.UPDATED);
}

export async function deleteSong(req: Request, res: Response): Promise<void> {
  await songService.deleteSong(req.params.id);
  sendSuccess(res, null, Messages.songs.DELETED);
}
