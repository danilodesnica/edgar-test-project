import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.method} ${req.originalUrl}`,
    });
};

export default notFoundHandler;
