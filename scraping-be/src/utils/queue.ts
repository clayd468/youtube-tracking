import Bull from 'bull';
import scrapingService from '../services/youtube.service';
import { MediaStatusEnum } from '../types';
import { logger } from './logger';

const mediaQueue = new Bull('mediaQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

mediaQueue.process(3, async (job) => {
  // logger.info(`Processing media id: ${job}`);

  // if (job.data.id) {
  //   try {
  //     const { images, videos } = await scrapingService.trackingVideo(job.data.id);
  //     await scrapingService.upsertMedia({ url: job.data.id, images, videos, status: MediaStatusEnum.COMPLETED });
  //   } catch (error) {
  //     logger.error(`Error scraping ${job.data.id}:`, error);
  //   }
  // }
});

export { mediaQueue };
