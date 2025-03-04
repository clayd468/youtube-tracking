import { User } from '../../types';
import { UserService } from '../../services/user.service';
import { prisma, logger } from '../../utils';

// Mocking the dependencies
jest.mock('../../utils', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    userMedia: {
      create: jest.fn(),
      createMany: jest.fn(),
    },
  },
  logger: {
    info: jest.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser: User = { id: 1, username: 'user1', password: 'password1' };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser(mockUser);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
      expect(logger.info).toHaveBeenCalledWith('Creating new user:', mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserByConditions', () => {
    it('should find a user by conditions', async () => {
      const mockUser: User = { id: 1, username: 'user1', password: 'password1' };
      const conditions = { id: 1 };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserByConditions(conditions);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: conditions,
      });
      expect(logger.info).toHaveBeenCalledWith('Finding user by conditions:', conditions);
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      const conditions = { id: 1 };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserByConditions(conditions);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: conditions,
      });
      expect(logger.info).toHaveBeenCalledWith('Finding user by conditions:', conditions);
      expect(result).toBeNull();
    });
  });

  describe('createUserMedia', () => {
    it('should create user media', async () => {
      const userId = 1;
      const mediaId = 1;
      (prisma.userMedia.create as jest.Mock).mockResolvedValue({});

      await userService.createUserMedia(userId, mediaId);

      expect(prisma.userMedia.create).toHaveBeenCalledWith({
        data: {
          userId,
          mediaId,
        },
      });
      expect(logger.info).toHaveBeenCalledWith('Creating user media:', { userId, mediaId });
    });
  });

  describe('bulkCreateUserMedia', () => {
    it('should bulk create user media', async () => {
      const userId = 1;
      const mediaIds = [1, 2, 3];
      (prisma.userMedia.createMany as jest.Mock).mockResolvedValue({});

      await userService.bulkCreateUserMedia(userId, mediaIds);

      expect(prisma.userMedia.createMany).toHaveBeenCalledWith({
        data: mediaIds.map((mediaId) => ({
          userId,
          mediaId,
        })),
      });
      expect(logger.info).toHaveBeenCalledWith('Bulk creating user media:', { userId, mediaIds });
    });
  });
});
