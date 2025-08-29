import { Router } from 'express';
import quotesController from '../controllers/quotes.controller';
import validate from '../middlewares/validate.middleware';
import { quotesQuerySchema } from '../schemas/common.schema';

const router = Router();

router.get('/', validate(quotesQuerySchema), quotesController.getQuotes);

export default router;
