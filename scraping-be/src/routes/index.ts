import express from 'express';
import UserRoutes from './user.routes';
import ScrapingRoutes from './scaping.routes';
import AuthRoutes from './auth.routes';
import MediaRoutes from './media.routes';

const router = express.Router();

router.use('/users', UserRoutes());
router.use('/scraping', ScrapingRoutes());
router.use('/auth', AuthRoutes());
router.use('/media', MediaRoutes());

export default router;
