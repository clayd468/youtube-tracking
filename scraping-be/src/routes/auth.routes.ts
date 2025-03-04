import { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRoute = () => {
  const router = Router();

  router.post('/login', authController.login);
  router.post('/register', authController.register);

  return router;
};

export default authRoute;
