import cheerio from 'cheerio';
import { IMAGE_PATTERN, VIDEO_PATTERN, VIDEO_SOURCES } from '../constants';
import { Media, MediaStatusEnum, ScrapingContent, ScrapingUrlsResult, SearchMediaParameters, SearchMediaResponse } from '../types';
import { validateImageSource, validateVideoSource } from '../utils/validate';
import {
  Prisma,
  prisma,
  searchAll,
  searchByImages,
  searchByUrl,
  searchByVideos,
  calculateLimitAndOffset,
  getMediaById,
  logger,
  mediaQueue,
} from '../utils';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page, Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import axios from 'axios';
import { google } from 'googleapis';

export class ScrapingService {
  private readonly youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });
  // async scrapeUrls(urls: string[]): Promise<ScrapingUrlsResult[]> {
  //   const results: ScrapingUrlsResult[] = [];

  //   await Promise.allSettled(
  //     urls.map(async (url) => {
  //       const { images, videos } = await this.scrapeUrlContent(url);
  //       results.push({ url, images, videos });
  //     }),
  //   );

  //   return results;
  // }

  async getMedia(url: string): Promise<Media | null> {
    logger.info(`Getting media by url: ${url}`);
    console.log('🚀 Debug url:', url, typeof url);
    return prisma.media.findUnique({
      where: { url },
    });
  }

  async searchMedia({ userId, type, searchText = '', page, limit: _limit }: SearchMediaParameters): Promise<SearchMediaResponse> {
    const { limit, offset } = calculateLimitAndOffset(page, _limit);
    const data = { userId, searchText, limit, offset };

    logger.info(`Searching media by ${type}`, data);

    switch (type) {
      case 'url':
        return searchByUrl(data);
      case 'images':
        return searchByImages(data);
      case 'videos':
        return searchByVideos(data);
      default:
        return searchAll(data);
    }
  }

  async upsertMedia(data: Partial<Media>): Promise<Media> {
    logger.info('Upserting media:', data);
    return prisma.media.upsert({
      where: { url: data.url },
      update: data,
      create: data as Media,
    });
  }

  async updateByConditions(conditions: Prisma.MediaWhereUniqueInput, data: Partial<Media>): Promise<Media> {
    logger.info('Updating media:', { conditions, data });
    return prisma.media.update({
      where: { ...conditions },
      data,
    });
  }

  async bulkUpdateMedia(medias: Media[]): Promise<any> {
    logger.info('Bulk updating media:', medias);
    return Promise.allSettled(
      medias.map(async (data) => {
        return prisma.media.upsert({
          where: { url: data.url },
          update: data,
          create: data,
        });
      }),
    ).then((results) => results.filter((result) => result.status === 'fulfilled').length);
  }

  async getMedias(): Promise<Media[]> {
    return prisma.media.findMany();
  }

  async scrapeUrlContent(media: Media): Promise<any> {
    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        maxResults: Number(process.env.MAX_SEARCH_RESULT || 10),
        type: ['video'],
        q: media.url,
      });

      const videos = response.data.items
        ?.map(({ id, snippet }) => ({
          videoId: id?.videoId,
          title: snippet?.title,
          description: snippet?.description,
        }))
        .filter((video) => Boolean(video.videoId));

      await scrapingService.updateByConditions({ id: media.id }, { status: MediaStatusEnum.PROCESSING });

      if (videos?.length) {
        const validVideoIds = videos.map((video) => video.videoId);
        const trackedVideos = await this.trackingVideos(validVideoIds.filter((id): id is string => !!id));

        return videos.map((video) => {
          const trackingData = trackedVideos.find((track) => track.id === video.videoId);

          return {
            ...video,
            viewCount: trackingData?.statistics.viewCount || '0',
            likeCount: trackingData?.statistics.likeCount || '0',
            favoriteCount: trackingData?.statistics.favoriteCount || '0',
            commentCount: trackingData?.statistics.commentCount || '0',
          };
        });
      }

      return { images: [], videos: [] };
    } catch (error) {
      await scrapingService.upsertMedia({ url: media.url, status: MediaStatusEnum.FAILED });
      console.error('Error scraping dynamic content:', error);
      throw error;
    }
  }

  async trackingVideos(videoIds: string[]): Promise<any> {
    try {
      const response = await this.youtube.videos.list({
        id: videoIds,
        part: ['statistics'],
      });

      return response.data?.items;
    } catch (error) {
      console.error('Error scraping dynamic content:', error);
      throw error;
    }
  }

  async extractImages(page: Page): Promise<string[]> {
    const result = await page.$$eval('img', (elements) => elements.flatMap((img) => [img.src, img['data-src']]));

    console.log(result, 'check images');

    // return unique image sources
    return Array.from(new Set(result)).filter(validateImageSource);
  }

  async extractVideoLinks(page: Page): Promise<string[]> {
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const sources = $(VIDEO_SOURCES.join(','))
      .map((i, el) => $(el).attr('src'))
      .toArray()
      .filter(validateVideoSource);

    return sources;
  }

  async getMediaByUserId(userId: number, mediaId: number): Promise<Media | null> {
    logger.info(`Getting media by ID: ${mediaId}`);
    return getMediaById({ userId, mediaId });
  }

  private uniqData(data: string[]) {
    return Array.from(new Set(data));
  }

  async autoScroll(page: Page, totalScrollTimeMs: number) {
    await page.evaluate((totalScrollTimeMs) => {
      return new Promise<void>((resolve) => {
        const distance = 100;
        const interval = 50; // Interval time in milliseconds
        let totalHeight = 0;
        const scrollHeight = document.body.scrollHeight;
        const maxSteps = totalScrollTimeMs / interval; // Calculate the maximum number of steps

        let steps = 0;
        const scrollInterval = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          steps += 1;

          if (steps >= maxSteps || totalHeight >= scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, interval);
      });
    }, totalScrollTimeMs);
  }
}

const scrapingService = new ScrapingService();

export default scrapingService;
