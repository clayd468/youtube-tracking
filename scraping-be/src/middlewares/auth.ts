import { jwtUtils } from '../utils';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './status';
import { ERROR_MESSAGES } from '../constants';

/**
 * Verify the token when user query
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from headers
    const token = req.headers['authorization']?.split(' ')[1];

    // Check if there is no token
    if (!token) return errorHandler({ message: ERROR_MESSAGES.NO_TOKEN_PROVIDED }, res);

    // Decode token
    const decoded = jwtUtils.decode(token);

    // Check is token is valid
    if (!decoded.valid) return errorHandler({ message: ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED }, res);

    // Set user id in request
    (req as any).userId = decoded.decoded?.userId;

    next();
  } catch (error) {
    throw error;
  }
};
