const AUTH_TOKEN_KEY = 'auth_token';

export interface User {
    email: string;
    name: string;
}

const USER_DATA_KEY = 'user_data';

export const setToken = (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const setUser = (user: User): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
};

export const removeUser = (): void => {
    localStorage.removeItem(USER_DATA_KEY);
};

export const clearAuth = (): void => {
    removeToken();
    removeUser();
};

export const loginUser = (email: string, password: string): Promise<{ token: string; user: User }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const token = `fake-token-${Date.now()}`;
            const user = {
                email,
                name: email.split('@')[0],
            };

            setToken(token);
            setUser(user);

            resolve({ token, user });
        }, 500);
    });
};

export const logoutUser = (): void => {
    clearAuth();
};
