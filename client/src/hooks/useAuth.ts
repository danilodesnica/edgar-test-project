import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    isAuthenticated,
    getUser,
    loginUser,
    logoutUser,
    User
} from '@/lib/storage';

export function useAuth() {
    const [user, setUser] = useState<User | null>(getUser());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticated = isAuthenticated();
        const userData = getUser();

        if (authenticated && userData) {
            setUser(userData);
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);

        try {
            const result = await loginUser(email, password);
            setUser(result.user);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        navigate('/login');
    };

    return {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout
    };
}
