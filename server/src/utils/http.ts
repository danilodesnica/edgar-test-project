import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import env from '../config/env';
import logger from '../config/logger';

const createHttpClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
    const instance = axios.create({
        timeout: env.requestTimeoutMs,
        headers: {
            'User-Agent': 'Edgar-Dashboard/1.0',
            'Accept': 'application/json',
        },
        ...config,
    });

    instance.interceptors.request.use(
        (config) => {
            if (env.isDev) {
                logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
            }
            return config;
        },
        (error) => {
            logger.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            if (env.isDev) {
                logger.debug(`Response: ${response.status} from ${response.config.url}`);
            }
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config;

            if (!originalRequest) {
                logger.error('No original request found in error');
                return Promise.reject(error);
            }

            if (
                (error.code === 'ECONNABORTED' ||
                    error.code === 'ETIMEDOUT' ||
                    (error.response && error.response.status >= 500)) &&
                !(originalRequest as any)._retry
            ) {
                logger.warn(`Retrying failed request to ${originalRequest.url}`);
                (originalRequest as any)._retry = true;
                return instance(originalRequest);
            }

            logger.error(`HTTP Error: ${error.message}`, {
                status: error.response?.status,
                url: originalRequest.url,
                method: originalRequest.method,
            });

            return Promise.reject(error);
        }
    );

    return instance;
};

export const http = createHttpClient();

export default createHttpClient;
