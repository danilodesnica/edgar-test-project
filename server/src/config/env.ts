import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.string().default('3001'),
    CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
    REQUEST_TIMEOUT_MS: z.string().transform(Number).default('8000'),
});

const env = envSchema.parse(process.env);

export default {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    clientOrigin: env.CLIENT_ORIGIN,
    requestTimeoutMs: env.REQUEST_TIMEOUT_MS,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
};
