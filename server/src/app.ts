import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import env from './config/env';
import logger from './config/logger';

const app = express();

app.use(cors({
    origin: env.clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.isDev) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use('/api', routes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    logger.info(`API available at http://localhost:${env.port}/api`);
});


export default app;