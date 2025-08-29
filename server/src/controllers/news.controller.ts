import { Request, Response, NextFunction } from 'express';
import newsService from '../services/news.service';
import { NewsQuery } from '../schemas/common.schema';
import logger from '../config/logger';

export class NewsController {
    async getTopStories(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.query as unknown as NewsQuery;

            logger.info(`Fetching news with params: ${JSON.stringify(params)}`);

            const news = await newsService.getTopStories(params);

            res.json({
                success: true,
                data: news,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new NewsController();
