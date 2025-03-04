import request from 'supertest';
import app from '../data/app';
import scrapingService from '../../services/youtube.service';
import { jwtUtils, redisInstance } from '../../utils';

// Mock the necessary dependencies
jest.mock('../../services/scraping.service');
jest.mock('../../utils/jwt');
jest.mock('../../utils/redis');

describe('MediaController', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoaW5lODg4OCIsInVzZXJJZCI6MSwiaWF0IjoxNzIxMDcxMDM3LCJleHAiOjE3NTI2Mjg2Mzd9.wtQrfkYMYIaQSkxRaEVIDNSMTqMBLGsEZJO91esC9JY';
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtUtils.decode as jest.Mock).mockReturnValue({ valid: true, decoded: { userId } });
  });

  describe('GET /api/v1/media', () => {
    it('should retrieve medias from cache successfully', async () => {
      const mockMedias = { results: [], totalRecords: 0 };
      const searchMemoKey = `search_medias:${userId}_images_test_1_10`;
      (redisInstance.getMemoData as jest.Mock).mockResolvedValue(JSON.stringify(mockMedias));

      const response = await request(app)
        .get('/api/v1/media')
        .query({
          type: 'images',
          searchText: 'test',
          page: '1',
          limit: '10',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMedias);
      expect(redisInstance.getMemoData).toHaveBeenCalledWith(searchMemoKey);
      expect(scrapingService.searchMedia).not.toHaveBeenCalled();
    });

    it('should retrieve medias from database and cache the result', async () => {
      const mockMedias = { results: [], totalRecords: 0 };
      const searchMemoKey = `search_medias:${userId}_images_test_1_10`;
      (redisInstance.getMemoData as jest.Mock).mockResolvedValue(null);
      (scrapingService.searchMedia as jest.Mock).mockResolvedValue(mockMedias);

      const response = await request(app)
        .get('/api/v1/media')
        .query({
          type: 'images',
          searchText: 'test',
          page: '1',
          limit: '10',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMedias);
      expect(redisInstance.getMemoData).toHaveBeenCalledWith(searchMemoKey);
      expect(scrapingService.searchMedia).toHaveBeenCalledWith({
        userId,
        type: 'images',
        searchText: 'test',
        page: '1',
        limit: '10',
      });
      expect(redisInstance.memoData).toHaveBeenCalled();
    });

    it('should return an error if there is an issue retrieving medias', async () => {
      const mockError = new Error('Error retrieving medias');
      const searchMemoKey = `search_medias:${userId}_images_test_1_10`;
      (redisInstance.getMemoData as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/v1/media')
        .query({
          type: 'images',
          searchText: 'test',
          page: '1',
          limit: '10',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error retrieving medias');
      expect(redisInstance.getMemoData).toHaveBeenCalledWith(searchMemoKey);
    });
  });

  describe('GET /api/v1/media/:id', () => {
    it('should retrieve media by ID from cache successfully', async () => {
      const mockMedia = { id: 1, title: 'Test Media' };
      (redisInstance.getMemoData as jest.Mock).mockResolvedValue(JSON.stringify(mockMedia));

      const response = await request(app).get('/api/v1/media/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMedia);
      expect(redisInstance.getMemoData).toHaveBeenCalledTimes(1);
      expect(scrapingService.getMediaByUserId).not.toHaveBeenCalled();
    });

    it('should retrieve media by ID from database and cache the result', async () => {
      const mockMedia = { id: 1, title: 'Test Media' };
      (redisInstance.getMemoData as jest.Mock).mockResolvedValue(null);
      (scrapingService.getMediaByUserId as jest.Mock).mockResolvedValue(mockMedia);

      const response = await request(app).get('/api/v1/media/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMedia);
      expect(redisInstance.memoData).toHaveBeenCalledTimes(1);
      expect(scrapingService.getMediaByUserId).toHaveBeenCalledWith(userId, 1);
    });

    it('should return an error if there is an issue retrieving media by ID', async () => {
      const mockError = new Error('Error retrieving media by ID');
      (redisInstance.getMemoData as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get('/api/v1/media/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error retrieving media by ID');
      expect(redisInstance.getMemoData).toHaveBeenCalledTimes(1);
    });
  });
});
