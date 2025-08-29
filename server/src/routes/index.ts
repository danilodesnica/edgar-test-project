import { Router } from 'express';
import quotesRoutes from './quotes.routes';
import newsRoutes from './news.routes';
import weatherRoutes from './weather.routes';
import { Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({
        ok: true,
        uptime: process.uptime(),
    });
});

router.use('/quotes', quotesRoutes);
router.use('/news', newsRoutes);
router.use('/weather', weatherRoutes);

export default router;
