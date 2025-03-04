import { NextFunction, Request, Response } from 'express';
import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible';
import { MAX_REQUEST_LIMIT, MAX_REQUEST_WINDOW } from '../constants';
import { ERROR_MESSAGES } from '../constants';

// Configure the rate limiter options
const options: IRateLimiterOptions = {
  duration: MAX_REQUEST_WINDOW,
  points: MAX_REQUEST_LIMIT,
};

// Create a new rate limiter instance
const rateLimiter = new RateLimiterMemory(options);

// Middleware function to enforce rate limiting
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter
    .consume((req as any).ip)
    .then((rateLimiterRes) => {
      // Set the Retry-After header to indicate when the client can make the next request
      res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
      // Set the X-RateLimit-Limit header to indicate the maximum number of requests allowed
      res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT);
      // Set the X-RateLimit-Remaining header to indicate the remaining number of requests within the window
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      // Set the X-RateLimit-Reset header to indicate the time when the rate limit will reset
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
      next();
    })
    .catch(() => {
      // Return a 429 Too Many Requests response with the error message
      res.status(429).json({ message: ERROR_MESSAGES.TOO_MANY_REQUESTS_MESSAGE });
    });
};
