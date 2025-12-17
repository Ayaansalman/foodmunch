import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);

    // Check token and get user profile on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data.user);
                    setToken(storedToken);
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('token');
                    setToken('');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        }
        return { success: false, message: response.data.message };
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        }
        return { success: false, message: response.data.message };
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
