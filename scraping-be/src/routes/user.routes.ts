import { Router } from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth';

const userRoute = () => {
  const router = Router();

  router.get('/:id', verifyToken, userController.getUserInfo);

  return router;
};

export default userRoute;
