import { User } from '../types';
import { Prisma, prisma, logger } from '../utils';

export class UserService {
  async createUser(user: User): Promise<User> {
    logger.info('Creating new user:', user);
    return await prisma.user.create({
      data: user,
    });
  }

  async findUserByConditions(conditions: Prisma.UserWhereUniqueInput): Promise<User | null> {
    logger.info('Finding user by conditions:', conditions);
    return prisma.user.findUnique({
      where: conditions,
    });
  }

  async createUserMedia(userId: number, mediaId: number): Promise<void> {
    logger.info('Creating user media:', { userId, mediaId });
    await prisma.userMedia.create({
      data: {
        userId,
        mediaId,
      },
    });
  }

  // async bulkCreateUserMedia(userId: number, mediaIds: number[]): Promise<void> {
  //   logger.info('Bulk creating user media:', { userId, mediaIds });
  //   const data = mediaIds.map((mediaId) => ({
  //     userId,
  //     mediaId,
  //   }));

  //   await prisma.userMedia.createMany({
  //     data,
  //   });
  // }
}

const userService = new UserService();
export default userService;
