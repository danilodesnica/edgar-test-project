import { Request, Response, NextFunction } from 'express';
import weatherService from '../services/weather.service';
import { WeatherQuery } from '../schemas/common.schema';
import logger from '../config/logger';

export class WeatherController {
    async getWeather(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.query as unknown as WeatherQuery;

            logger.info(`Fetching weather for city: ${params.city}`);

            const weather = await weatherService.getWeather(params);

            res.json({
                success: true,
                data: weather,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new WeatherController();
