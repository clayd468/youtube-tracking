import request from 'supertest';
import app from '../data/app';
import userService from '../../services/user.service';
import { jwtUtils } from '../../utils';

// Mock the necessary dependencies
jest.mock('../../services/user.service');
jest.mock('../../utils/jwt');

describe('UserController', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoaW5lODg4OCIsInVzZXJJZCI6MSwiaWF0IjoxNzIxMDcxMDM3LCJleHAiOjE3NTI2Mjg2Mzd9.wtQrfkYMYIaQSkxRaEVIDNSMTqMBLGsEZJO91esC9JY';
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtUtils.decode as jest.Mock).mockReturnValue({ valid: true, decoded: { userId } });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should retrieve user info successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      (userService.findUserByConditions as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get(`/api/v1/users/${userId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ id: userId });
    });

    it('should return an error if user info retrieval fails', async () => {
      const mockError = new Error('Error retrieving user info');
      (userService.findUserByConditions as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app).get(`/api/v1/users/${userId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error retrieving user info');
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ id: userId });
    });
  });
});
