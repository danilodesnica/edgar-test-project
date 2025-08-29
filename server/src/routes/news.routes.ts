import { Router } from 'express';
import newsController from '../controllers/news.controller';
import validate from '../middlewares/validate.middleware';
import { newsQuerySchema } from '../schemas/common.schema';

const router = Router();

router.get('/top', validate(newsQuerySchema), newsController.getTopStories);

export default router;
