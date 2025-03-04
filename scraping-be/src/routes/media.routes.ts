import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { validate } from 'express-validation';
import mediaController from '../controllers/media.controller';
import { getMediaByIdValidation, searchMediaValidation } from '../validations';

const mediaRoute = () => {
  const router = Router();

  router.get('/', verifyToken, validate(searchMediaValidation), mediaController.getMedias);
  router.get('/:id', verifyToken, validate(getMediaByIdValidation), mediaController.getMediaById);

  return router;
};

export default mediaRoute;
