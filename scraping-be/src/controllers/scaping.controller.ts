import { Request, Response } from 'express';
import { errorHandler, successHandler } from '../middlewares/status';
import scrapingService from '../services/youtube.service';
import httpStatus from 'http-status';
import { redisInstance, logger, mediaQueue } from '../utils';
import { Media } from '@prisma/client';
import userService from '../services/user.service';
import { IRequest, MediaStatusEnum, ScrapingUrlsResult } from '../types';

class ScapingController {
  async scrapeData(req: Request, res: Response) {
    try {
      const userId = (req as IRequest).userId;

      // Scrape the data from the URL
       const url = req.body.url?.[0] as string;
      logger.info('url:', url);

      let result: ScrapingUrlsResult;

      const memoKey = await redisInstance.getMediaMemoKey(userId, url);
      logger.info('memoKey:', memoKey);

      const memoData = await redisInstance.getMemoData(memoKey);

      if (memoData) {
        result = JSON.parse(memoData);
      } else {
        const media = await scrapingService.getMedia(url);

        if (media) {
          result = media as ScrapingUrlsResult;
          await redisInstance.memoData(memoKey, media);
        } else {
          const media = await scrapingService.upsertMedia({ url } as Media);
          await userService.createUserMedia(userId, media.id);
          await scrapingService.scrapeUrlContent(media);
          result = { url, images: [], videos: [], status: MediaStatusEnum.PENDING };
        }
      }

      // const existedIds = results.map((result) => result.id).filter(Boolean);

      if (result.id) {
        await userService.createUserMedia(userId, result.id);
      }

      logger.info('scraping results:', result);

      // Example code to send success response
      successHandler(res, httpStatus.OK, result);
    } catch (error) {
      // Example code to handle errors
      logger.error('Error scraping data', { error });
      errorHandler(error, res);
    }
  }
}

const scrapingController = new ScapingController();

export default scrapingController;
