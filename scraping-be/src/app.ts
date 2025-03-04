import express, { NextFunction, Request, Response } from 'express';

import { prisma } from './utils/prisma';
import { rateLimiterMiddleware } from './middlewares/ratelimiter';
import { serverProxy } from './middlewares/proxy';
import { ValidationError } from 'express-validation';
import { errorHandler } from './middlewares/status';
import appRoutes from './routes';
import cors from 'cors';
import { HOST, PORT } from './constants';

// This class represents the main application
class App {
  static app = express();

  // Returns the singleton instance of the App class
  public static getInstance(): App {
    App.start();
    return App.app;
  }

  // Starts the application
  static start(): void {
    // enable cors
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    this.app.set('trust proxy', 1);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(rateLimiterMiddleware);

    this.app.use('/api/v1', appRoutes);

    // Proxy all other requests to the server
    // this.app.all('/*', (req: Request, res: Response) => {
    //   serverProxy(req, res);
    // });

    // Error handling middleware
    this.app.use((err: ValidationError, _req: Request, res: Response, next: NextFunction) => errorHandler(err, res));

    // Start the server
    this.app.listen(PORT, async () => {
      await prisma.$connect();

      console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
    });
  }
}

export default App;
