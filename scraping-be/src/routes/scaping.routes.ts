import { Router } from 'express';
import scrapingController from '../controllers/scaping.controller';
import { verifyToken } from '../middlewares/auth';
import { validate } from 'express-validation';
import { createScrapingUrlsValidation } from '../validations';

const scrapingRoute = () => {
  const router = Router();

  router.post('/', verifyToken, validate(createScrapingUrlsValidation), scrapingController.scrapeData);

  return router;
};

export default scrapingRoute;
