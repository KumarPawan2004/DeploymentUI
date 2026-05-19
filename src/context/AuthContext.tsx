import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        const storedToken = sessionStorage.getItem('token');
        // Validate token isn't the string "undefined"
        return storedToken && storedToken !== 'undefined' ? storedToken : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Safely get and parse user data
        const storedUser = sessionStorage.getItem('user');

        let parsedUser = null;
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                // Clear corrupted data
                sessionStorage.removeItem('user');
            }
        }

        setUser(parsedUser);
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', { email, password });

            const { token: newToken, user: userData } = response.data;

            console.log('Login Successful - User:', userData);
            console.log('Role:', userData?.role);

            // Only store if data is valid
            if (newToken && newToken !== 'undefined') {
                sessionStorage.setItem('token', newToken);
            }
            if (userData && userData !== 'undefined') {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }

            setToken(newToken);
            setUser(userData);

            toast.success(`Welcome back, ${userData.fullName}!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};