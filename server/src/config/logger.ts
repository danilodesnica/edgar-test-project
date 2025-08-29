import pino from 'pino';
import env from './env';

const logger = pino({
    level: env.isDev ? 'debug' : 'info',
    transport: env.isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});

export default logger;
