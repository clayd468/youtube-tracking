import { Request, Response } from 'express';
import { errorHandler, successHandler } from '../middlewares/status';
import userService from '../services/user.service';
import { logger } from '../utils';

class UserController {
  /**
   * Get user info
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async getUserInfo(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      logger.info('Received request to get user info for userId:', userId);

      const user = await userService.findUserByConditions({ id: Number(userId) });
      logger.info('Retrieved user info:', user);

      successHandler(res, 200, user);
    } catch (error: any) {
      logger.error('An error occurred while getting user info:', error);
      errorHandler({ message: error.message }, res);
    }
  }
}

const userController = new UserController();

export default userController;
