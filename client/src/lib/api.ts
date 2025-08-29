import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    details?: any;
}

const api: AxiosInstance = axios.create({
    baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your connection.',
            });
        }

        const errorResponse = error.response.data as ApiResponse<any>;

        return Promise.reject({
            status: error.response.status,
            message: errorResponse.message || 'An error occurred',
            details: errorResponse.details,
        });
    }
);

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
};

export default api;
