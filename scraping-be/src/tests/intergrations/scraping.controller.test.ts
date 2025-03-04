import request from 'supertest';
import app from '../data/app';
import scrapingService from '../../services/youtube.service';
import userService from '../../services/user.service';
import { redisInstance, mediaQueue } from '../../utils';
import { jwtUtils } from '../../utils';
import { MediaStatusEnum } from '../../types';

// Mock the necessary dependencies
jest.mock('../../services/scraping.service');
jest.mock('../../services/user.service');
jest.mock('../../utils/redis');
jest.mock('../../utils/queue');
jest.mock('../../utils/jwt');

describe('ScrapingController', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoaW5lODg4OCIsInVzZXJJZCI6MSwiaWF0IjoxNzIxMDcxMDM3LCJleHAiOjE3NTI2Mjg2Mzd9.wtQrfkYMYIaQSkxRaEVIDNSMTqMBLGsEZJO91esC9JY';
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtUtils.decode as jest.Mock).mockReturnValue({ valid: true, decoded: { userId } });
  });

  describe('POST /api/v1/scrape', () => {
    it('should scrape data successfully', async () => {
      const mockUrls = ['https://example.com'];
      const mockMedia = { id: 1, url: 'https://example.com', images: [], videos: [], status: MediaStatusEnum.PENDING };
      const mockMemoKey = 'memoKey';
      const mockMemoData = JSON.stringify({ id: 1, url: 'https://example.com', images: [], videos: [], status: MediaStatusEnum.PENDING });

      (redisInstance.getMediaMemoKey as jest.Mock).mockResolvedValue(mockMemoKey);
      (redisInstance.getMemoData as jest.Mock).mockResolvedValue(null);
      (scrapingService.getMedia as jest.Mock).mockResolvedValue(null);
      (scrapingService.upsertMedia as jest.Mock).mockResolvedValue(mockMedia);
      (userService.createUserMedia as jest.Mock).mockResolvedValue({});
      (userService.bulkCreateUserMedia as jest.Mock).mockResolvedValue({});
      (redisInstance.memoData as jest.Mock).mockResolvedValue({});
      (mediaQueue.add as jest.Mock).mockResolvedValue({});

      const response = await request(app).post('/api/v1/scraping').set('Authorization', `Bearer ${token}`).send({ urls: mockUrls });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([{ url: 'https://example.com', images: [], videos: [], status: MediaStatusEnum.PENDING }]);
      expect(redisInstance.getMediaMemoKey).toHaveBeenCalledWith(userId, mockUrls[0]);
      expect(redisInstance.getMemoData).toHaveBeenCalledWith(mockMemoKey);
      expect(scrapingService.getMedia).toHaveBeenCalledWith('https://example.com');
      expect(scrapingService.upsertMedia).toHaveBeenCalledWith({ url: 'https://example.com' });
      expect(userService.createUserMedia).toHaveBeenCalledWith(userId, 1);
      expect(mediaQueue.add).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return an error if there is an issue scraping data', async () => {
      const mockUrls = ['https://example.com'];
      const mockError = new Error('Error scraping data');

      (redisInstance.getMediaMemoKey as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).post('/api/v1/scraping').set('Authorization', `Bearer ${token}`).send({ urls: mockUrls });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error scraping data');
      expect(redisInstance.getMediaMemoKey).toHaveBeenCalledWith(userId, mockUrls[0]);
    });
  });
});
