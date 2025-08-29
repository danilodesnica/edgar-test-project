import { Router } from 'express';
import weatherController from '../controllers/weather.controller';
import validate from '../middlewares/validate.middleware';
import { weatherQuerySchema } from '../schemas/common.schema';

const router = Router();

router.get('/', validate(weatherQuerySchema), weatherController.getWeather);

export default router;
