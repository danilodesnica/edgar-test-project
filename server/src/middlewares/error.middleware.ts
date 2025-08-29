import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';
import logger from '../config/logger';

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    if (err instanceof AxiosError) {
        const statusCode = err.response?.status || 500;
        const message = err.response?.data?.message || err.message;

        return res.status(statusCode).json({
            success: false,
            message: `External API error: ${message}`,
            details: {
                url: err.config?.url,
                status: err.response?.status,
            },
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};

export default errorHandler;
