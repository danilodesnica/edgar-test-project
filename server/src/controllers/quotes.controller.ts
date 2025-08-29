import { Request, Response, NextFunction } from 'express';
import quotesService from '../services/quotes.service';
import { QuotesQuery } from '../schemas/common.schema';
import logger from '../config/logger';

export class QuotesController {
    async getQuotes(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.query as unknown as QuotesQuery;

            logger.info(`Fetching quotes with params: ${JSON.stringify(params)}`);

            const quotes = await quotesService.getQuotes(params);

            res.json({
                success: true,
                data: quotes,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new QuotesController();
