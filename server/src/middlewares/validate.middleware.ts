import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../config/logger';


export const validate = (schema: AnyZodObject, target: 'query' | 'params' | 'body' = 'query') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req[target]);

            req[target] = validated;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.debug('Validation error:', error.errors);

                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    details: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }

            next(error);
        }
    };
};

export default validate;
