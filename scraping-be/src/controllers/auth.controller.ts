import { User } from '@prisma/client';
import { ERROR_MESSAGES } from '../constants';
import { errorHandler, successHandler } from '../middlewares/status';
import userService from '../services/user.service';
import { logger, jwtUtils } from '../utils';
import { Request, Response } from 'express';

class AuthController {
  /**
   * Register new user
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Get information from req body
      const { username, password } = req.body;
      logger.info('Received registration request for username:', username);

      const user = await userService.findUserByConditions({ username });

      // Check if user exists
      if (user) {
        logger.error('User already exists:', username);
        return errorHandler({ message: ERROR_MESSAGES.USER_EXISTED }, res);
      }

      // Hash password
      const hashedPassword = await jwtUtils.generateHashedPassword(password);
      logger.info('Generated hashed password for user:', username);

      // Create new user
      const newUser = await userService.createUser({ username, password: hashedPassword } as User);
      logger.info('Created new user:', newUser);

      successHandler(res, 200, { userId: newUser.id });
    } catch (error: any) {
      logger.error('An error occurred during registration:', error);
      errorHandler(error, res);
    }
  }

  /**
   * Login
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Get email, password from req body
      const { username, password } = req.body;
      logger.info('Received login request for username:', username);

      const user = await userService.findUserByConditions({ username });

      // Check if user exists
      if (!user) {
        logger.error('User not found:', username);
        return errorHandler({ message: ERROR_MESSAGES.USER_NOT_FOUND }, res);
      }

      // Compare password
      if (!(await jwtUtils.comparePassword(password, user.password))) {
        logger.error('Invalid password for user:', username);
        return errorHandler({ message: ERROR_MESSAGES.PASSWORD_OR_EMAIL_INVALID }, res);
      }

      successHandler(res, 200, {
        accessToken: jwtUtils.generateAccessToken(user.username, user.id),
        userId: user.id,
      });
    } catch (error: any) {
      logger.error('An error occurred during login:', error);
      errorHandler({ message: error.message }, res);
    }
  }
}

const authController = new AuthController();
export default authController;
