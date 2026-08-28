import { Request, Response } from 'express';
import { StatisticsService } from './statistics.service';
import { sendSuccess } from '../../common/utils/response';
import { Messages } from '../../common/constants/messages';

const statisticsService = new StatisticsService();

export async function getStatistics(_req: Request, res: Response): Promise<void> {
  const stats = await statisticsService.getStatistics();
  sendSuccess(res, stats, Messages.statistics.FETCHED);
}
