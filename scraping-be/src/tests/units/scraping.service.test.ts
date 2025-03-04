import cheerio from 'cheerio';
import { prisma, logger, calculateLimitAndOffset, getMediaById, searchAll, searchByImages, searchByUrl, searchByVideos } from '../../utils';
import { ScrapingService } from '../../services/youtube.service';
import { Media, MediaStatusEnum, ScrapingUrlsResult, SearchMediaParameters, SearchMediaResponse } from '../../types';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

jest.mock('puppeteer-extra');

puppeteer.use(StealthPlugin());

// Mocking the dependencies
jest.mock('../../utils', () => ({
  prisma: {
    media: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  },
  logger: {
    info: jest.fn(),
  },
  calculateLimitAndOffset: jest.fn(),
  getMediaById: jest.fn(),
  searchAll: jest.fn(),
  searchByImages: jest.fn(),
  searchByUrl: jest.fn(),
  searchByVideos: jest.fn(),
}));

jest.mock('puppeteer');
jest.mock('cheerio');
jest.mock('../../utils/validate', () => ({
  validateImageSource: jest.fn((src) => src),
  validateVideoSource: jest.fn((src) => src),
}));

describe('ScrapingService', () => {
  let scrapingService: ScrapingService;
  let mockBrowser: Browser;
  let mockPage: Page;

  beforeEach(() => {
    scrapingService = new ScrapingService();
    mockBrowser = {
      newPage: jest.fn(),
      close: jest.fn(),
    } as unknown as Browser;
    mockPage = {
      goto: jest.fn(),
      content: jest.fn(),
      $$eval: jest.fn(),
      close: jest.fn(),
      setUserAgent: jest.fn(),
      on: jest.fn(),
      evaluate: jest.fn(),
    } as unknown as Page;

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    (mockBrowser.newPage as jest.Mock).mockResolvedValue(mockPage);

    // Mock cheerio
    (cheerio.load as jest.Mock).mockReturnValue((htmlContent: string) => ({
      find: jest.fn().mockReturnValue({
        map: jest.fn().mockReturnValue({
          toArray: jest.fn().mockReturnValue(['vid1', 'vid2']),
        }),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeUrls', () => {
    it('should scrape URLs and return results', async () => {
      const urls = ['https://example.com'];
      const scrapeUrlContentMock = jest.spyOn(scrapingService, 'scrapeUrlContent').mockResolvedValue({ images: ['img1'], videos: ['vid1'] });

      const result = await scrapingService.scrapeUrls(urls);

      expect(scrapeUrlContentMock).toHaveBeenCalledWith(urls[0]);
      expect(result).toEqual([{ url: urls[0], images: ['img1'], videos: ['vid1'] }]);
    });
  });

  describe('extractImages', () => {
    it('should extract images from the page', async () => {
      (mockPage.$$eval as jest.Mock).mockResolvedValue(['img1', 'img2']);
      const result = await scrapingService.extractImages(mockPage);

      expect(mockPage.$$eval).toHaveBeenCalledWith('img', expect.any(Function));
      expect(result).toEqual(['img1', 'img2']);
    });
  });

  describe('scrapeUrls', () => {
    it('should scrape URLs and return results', async () => {
      const urls = ['https://example.com'];
      const scrapeUrlContentMock = jest.spyOn(scrapingService, 'scrapeUrlContent').mockResolvedValue({ images: ['img1'], videos: ['vid1'] });

      const result = await scrapingService.scrapeUrls(urls);

      expect(scrapeUrlContentMock).toHaveBeenCalledWith(urls[0]);
      expect(result).toEqual([{ url: urls[0], images: ['img1'], videos: ['vid1'] }]);
    });
  });

  describe('getMedia', () => {
    it('should get media by URL', async () => {
      const url = 'https://example.com';
      const mockMedia: Media = { id: 1, url, status: MediaStatusEnum.PROCESSING } as Media;
      (prisma.media.findUnique as jest.Mock).mockResolvedValue(mockMedia);

      const result = await scrapingService.getMedia(url);

      expect(prisma.media.findUnique).toHaveBeenCalledWith({ where: { url } });
      expect(logger.info).toHaveBeenCalledWith(`Getting media by url: ${url}`);
      expect(result).toEqual(mockMedia);
    });
  });

  describe('searchMedia', () => {
    it('should search media by URL', async () => {
      const params: SearchMediaParameters = { userId: 1, type: 'url', searchText: 'test', page: '1', limit: '10' };
      const mockResponse: SearchMediaResponse = { results: [], totalRecords: 0 };
      (calculateLimitAndOffset as jest.Mock).mockReturnValue({ limit: 10, offset: 0 });
      (searchByUrl as jest.Mock).mockResolvedValue(mockResponse);

      const result = await scrapingService.searchMedia(params);

      expect(calculateLimitAndOffset).toHaveBeenCalledWith(params.page, params.limit);
      expect(searchByUrl).toHaveBeenCalledWith({ userId: params.userId, searchText: params.searchText, limit: 10, offset: 0 });
      expect(result).toEqual(mockResponse);
    });

    it('should search media by images', async () => {
      const params: SearchMediaParameters = { userId: 1, type: 'images', searchText: 'test', page: '1', limit: '10' };
      const mockResponse: SearchMediaResponse = { results: [], totalRecords: 0 };
      (calculateLimitAndOffset as jest.Mock).mockReturnValue({ limit: 10, offset: 0 });
      (searchByImages as jest.Mock).mockResolvedValue(mockResponse);

      const result = await scrapingService.searchMedia(params);

      expect(calculateLimitAndOffset).toHaveBeenCalledWith(params.page, params.limit);
      expect(searchByImages).toHaveBeenCalledWith({ userId: params.userId, searchText: params.searchText, limit: 10, offset: 0 });
      expect(result).toEqual(mockResponse);
    });

    it('should search media by videos', async () => {
      const params: SearchMediaParameters = { userId: 1, type: 'videos', searchText: 'test', page: '1', limit: '10' };
      const mockResponse: SearchMediaResponse = { results: [], totalRecords: 0 };
      (calculateLimitAndOffset as jest.Mock).mockReturnValue({ limit: 10, offset: 0 });
      (searchByVideos as jest.Mock).mockResolvedValue(mockResponse);

      const result = await scrapingService.searchMedia(params);

      expect(calculateLimitAndOffset).toHaveBeenCalledWith(params.page, params.limit);
      expect(searchByVideos).toHaveBeenCalledWith({ userId: params.userId, searchText: params.searchText, limit: 10, offset: 0 });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('upsertMedia', () => {
    it('should upsert media', async () => {
      const mockMedia: Partial<Media> = { url: 'https://example.com' };
      const mockUpsertedMedia: Media = { id: 1, ...mockMedia } as Media;
      (prisma.media.upsert as jest.Mock).mockResolvedValue(mockUpsertedMedia);

      const result = await scrapingService.upsertMedia(mockMedia);

      expect(prisma.media.upsert).toHaveBeenCalledWith({
        where: { url: mockMedia.url },
        update: mockMedia,
        create: mockMedia,
      });
      expect(logger.info).toHaveBeenCalledWith('Upserting media:', mockMedia);
      expect(result).toEqual(mockUpsertedMedia);
    });
  });

  describe('updateByConditions', () => {
    it('should update media by conditions', async () => {
      const conditions = { id: 1 };
      const data: Partial<Media> = { videos: ['https://videos.com'] };
      const mockUpdatedMedia: Media = { id: 1, url: 'https://example.com', videos: ['https://videos.com'] } as Media;
      (prisma.media.update as jest.Mock).mockResolvedValue(mockUpdatedMedia);

      const result = await scrapingService.updateByConditions(conditions, data);

      expect(prisma.media.update).toHaveBeenCalledWith({
        where: conditions,
        data,
      });
      expect(logger.info).toHaveBeenCalledWith('Updating media:', { conditions, data });
      expect(result).toEqual(mockUpdatedMedia);
    });
  });

  describe('bulkUpdateMedia', () => {
    it('should bulk update media', async () => {
      const medias: Media[] = [{ id: 1, url: 'https://example.com/1' } as Media, { id: 2, url: 'https://example.com/2' } as Media];
      const mockResults = medias.map((media) => ({ status: 'fulfilled', value: media }));
      (prisma.media.upsert as jest.Mock).mockResolvedValue({});
      const allSettledMock = jest.spyOn(Promise, 'allSettled').mockResolvedValue(mockResults as any);

      const result = await scrapingService.bulkUpdateMedia(medias);

      expect(prisma.media.upsert).toHaveBeenCalledTimes(medias.length);
      expect(allSettledMock).toHaveBeenCalledWith(expect.anything());
      expect(logger.info).toHaveBeenCalledWith('Bulk updating media:', medias);
      expect(result).toEqual(medias.length);
    });
  });

  describe('getMedias', () => {
    it('should get all medias', async () => {
      const mockMedias: Media[] = [{ id: 1, url: 'https://example.com/1' } as Media, { id: 2, url: 'https://example.com/2' } as Media];
      (prisma.media.findMany as jest.Mock).mockResolvedValue(mockMedias);

      const result = await scrapingService.getMedias();

      expect(prisma.media.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockMedias);
    });
  });

  describe('scrapeUrlContent', () => {
    it('should throw error if scraping fails', async () => {
      const url = 'https://example.com';
      (mockPage.goto as jest.Mock).mockRejectedValue(new Error('Failed to scrape URL'));

      await expect(scrapingService.scrapeUrlContent(url)).rejects.toThrow('Failed to scrape URL');
    });

    it('should scrape URL content', async () => {
      const url = 'https://example.com';
      (mockPage.goto as jest.Mock).mockResolvedValue({});
      (mockPage.$$eval as jest.Mock).mockResolvedValue(['img1', 'img2']);
      (mockPage.content as jest.Mock).mockResolvedValue('<html></html>');

      // Mock cheerio load function to return a jQuery-like object
      (cheerio.load as jest.Mock).mockReturnValue(() => ({
        map: jest.fn().mockReturnValue({
          toArray: jest.fn().mockReturnValue(['vid1', 'vid2']),
        }),
      }));

      const result = await scrapingService.scrapeUrlContent(url);

      expect(puppeteer.launch).toHaveBeenCalled();
      expect(mockBrowser.newPage).toHaveBeenCalled();
      expect(mockPage.goto).toHaveBeenCalledWith(url, { waitUntil: 'domcontentloaded' });
      expect(mockPage.$$eval).toHaveBeenCalled();
      expect(mockPage.content).toHaveBeenCalled();
      expect(cheerio.load).toHaveBeenCalled();
      expect(result).toEqual({ images: ['img1', 'img2'], videos: ['vid1', 'vid2'] });
    });
  });

  describe('extractImages', () => {
    it('should extract images from the page', async () => {
      (mockPage.$$eval as jest.Mock).mockResolvedValue(['img1', 'img2']);
      const result = await scrapingService.extractImages(mockPage);

      expect(mockPage.$$eval).toHaveBeenCalledWith('img', expect.any(Function));
      expect(result).toEqual(['img1', 'img2']);
    });
  });

  describe('extractVideoLinks', () => {
    it('should extract video links from the page', async () => {
      const htmlContent = '<html></html>';
      (mockPage.content as jest.Mock).mockResolvedValue(htmlContent);

      // Mock cheerio load function to return a jQuery-like object
      (cheerio.load as jest.Mock).mockReturnValue(() => ({
        map: jest.fn().mockReturnValue({
          toArray: jest.fn().mockReturnValue(['vid1', 'vid2']),
        }),
      }));

      const result = await scrapingService.extractVideoLinks(mockPage);

      expect(mockPage.content).toHaveBeenCalled();
      expect(cheerio.load).toHaveBeenCalledWith(htmlContent);
      expect(result).toEqual(['vid1', 'vid2']);
    });
  });

  describe('getMediaByUserId', () => {
    it('should get media by user ID and media ID', async () => {
      const userId = 1;
      const mediaId = 1;
      const mockMedia: Media = { id: 1, url: 'https://example.com' } as Media;
      (getMediaById as jest.Mock).mockResolvedValue(mockMedia);

      const result = await scrapingService.getMediaByUserId(userId, mediaId);

      expect(getMediaById).toHaveBeenCalledWith({ userId, mediaId });
      expect(logger.info).toHaveBeenCalledWith(`Getting media by ID: ${mediaId}`);
      expect(result).toEqual(mockMedia);
    });
  });
});
