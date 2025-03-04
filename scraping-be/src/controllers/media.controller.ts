import httpStatus from 'http-status';
import { successHandler, errorHandler } from '../middlewares/status';
import scrapingService from '../services/youtube.service';
import { IRequest } from '../types';
import { logger, redisInstance } from '../utils';
import { Request, Response } from 'express';

class MediaController {
  async getMedias(req: Request, res: Response) {
    try {
      const userId = (req as IRequest).userId;
      const { type, searchText, page, limit } = req.query;

      // Create a memo key
      const searchMemoKey = `search_medias:${userId}_${type}_${searchText}_${page}_${limit}`;

      // Check if data is in the cache
      const cachedMedias = await redisInstance.getMemoData(searchMemoKey);
      if (cachedMedias) {
        logger.info('Returning cached medias...');
        return successHandler(res, httpStatus.OK, JSON.parse(cachedMedias));
      }

      logger.info('Getting medias...');
      const medias = await scrapingService.searchMedia({
        userId,
        type: type as any,
        searchText: searchText as string,
        page: page as string,
        limit: limit as string,
      });

      // Cache the result
      await redisInstance.memoData(searchMemoKey, medias, 3);

      logger.info('Medias retrieved:', medias);
      successHandler(res, httpStatus.OK, medias);
    } catch (error) {
      logger.error('Error getting medias:', { error });
      errorHandler(error, res);
    }
  }

  async getMediaById(req: Request, res: Response) {
    try {
      const userId = (req as IRequest).userId;
      const { id } = req.params;
      logger.info('Getting media by ID', id);

      // Check if data is in the cache
      const memoKey = await redisInstance.getMediaMemoKey(userId, id);
      const cachedMedia = await redisInstance.getMemoData(memoKey);
      if (cachedMedia) {
        logger.info('Returning cached media...');
        return successHandler(res, httpStatus.OK, JSON.parse(cachedMedia));
      }

      const media = await scrapingService.getMediaByUserId(userId, Number(id));
      // Cache the result
      redisInstance.memoData(memoKey, media);

      logger.info('Media retrieved:', media);
      successHandler(res, httpStatus.OK, media);
    } catch (error) {
      logger.error('Error getting media by ID:', { error });
      errorHandler(error, res);
    }
  }
}

const mediaController = new MediaController();
export default mediaController;
