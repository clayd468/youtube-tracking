import request from 'supertest';
import app from '../data/app';
import userService from '../../services/user.service';
import { jwtUtils } from '../../utils';
import { ERROR_MESSAGES } from '../../constants';

// Mock the necessary dependencies
jest.mock('../../services/user.service');
jest.mock('../../utils/jwt');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = { id: 1, username: 'testuser', password: 'hashedpassword' };

      (userService.findUserByConditions as jest.Mock).mockResolvedValue(null);
      (jwtUtils.generateHashedPassword as jest.Mock).mockResolvedValue('hashedpassword');
      (userService.createUser as jest.Mock).mockResolvedValue(newUser);

      const response = await request(app).post('/api/v1/auth/register').send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.data.userId).toEqual(newUser.id);
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ username: 'testuser' });
      expect(jwtUtils.generateHashedPassword).toHaveBeenCalledWith('password');
      expect(userService.createUser).toHaveBeenCalledWith({ username: 'testuser', password: 'hashedpassword' });
    });

    it('should return an error if the user already exists', async () => {
      const existingUser = { id: 1, username: 'testuser', password: 'hashedpassword' };

      (userService.findUserByConditions as jest.Mock).mockResolvedValue(existingUser);

      const response = await request(app).post('/api/v1/auth/register').send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(ERROR_MESSAGES.USER_EXISTED);
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ username: 'testuser' });
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully', async () => {
      const existingUser = { id: 1, username: 'testuser', password: 'hashedpassword' };

      (userService.findUserByConditions as jest.Mock).mockResolvedValue(existingUser);
      (jwtUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('accessToken');

      const response = await request(app).post('/api/v1/auth/login').send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toEqual('accessToken');
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ username: 'testuser' });
      expect(jwtUtils.comparePassword).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith('testuser', existingUser.id);
    });

    it('should return an error if the user does not exist', async () => {
      (userService.findUserByConditions as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/v1/auth/login').send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(ERROR_MESSAGES.USER_NOT_FOUND);
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ username: 'testuser' });
      expect(jwtUtils.comparePassword).not.toHaveBeenCalled();
      expect(jwtUtils.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should return an error if the password is invalid', async () => {
      const existingUser = { id: 1, username: 'testuser', password: 'hashedpassword' };

      (userService.findUserByConditions as jest.Mock).mockResolvedValue(existingUser);
      (jwtUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      const response = await request(app).post('/api/v1/auth/login').send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(ERROR_MESSAGES.PASSWORD_OR_EMAIL_INVALID);
      expect(userService.findUserByConditions).toHaveBeenCalledWith({ username: 'testuser' });
      expect(jwtUtils.comparePassword).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(jwtUtils.generateAccessToken).not.toHaveBeenCalled();
    });
  });
});
