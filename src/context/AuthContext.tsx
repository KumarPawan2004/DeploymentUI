import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

/** Map login/auth payload whether API uses camelCase or ASP.NET PascalCase JSON. */
function normalizeAuthPayload(data: Record<string, unknown> | null | undefined): {
    token: string | null;
    user: User | null;
} {
    if (!data || typeof data !== 'object') return { token: null, user: null };

    const token = (data.token ?? data.Token) as string | undefined;

    const rawUser = (data.user ?? data.User) as Record<string, unknown> | undefined;
    if (!rawUser || typeof rawUser !== 'object') {
        return { token: token && token !== 'undefined' ? token : null, user: null };
    }

    const id = rawUser.id ?? rawUser.Id;
    const fullName = (rawUser.fullName ?? rawUser.FullName ?? '') as string;
    const email = (rawUser.email ?? rawUser.Email ?? '') as string;
    let roleRaw = (rawUser.role ?? rawUser.Role ?? 'User') as string;
    roleRaw =
        typeof roleRaw === 'string'
            ? roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1).toLowerCase()
            : 'User';
    const role: User['role'] = roleRaw === 'Admin' ? 'Admin' : 'User';
    const isBlocked = Boolean(rawUser.isBlocked ?? rawUser.IsBlocked);

    const user: User = {
        id: String(id ?? ''),
        fullName,
        email,
        role,
        isBlocked,
    };

    return {
        token: token && token !== 'undefined' ? token : null,
        user,
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string, role: 'User' | 'Admin') => Promise<void>;
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

        let parsedUser: User | null = null;
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
                const raw = JSON.parse(storedUser) as Record<string, unknown>;
                parsedUser = normalizeAuthPayload({ user: raw }).user;
            } catch (error) {
                console.error('Failed to parse user data:', error);
                // Clear corrupted data
                sessionStorage.removeItem('user');
            }
        }

        setUser(parsedUser);
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string, role: 'User' | 'Admin') => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password,
                role
            });

            const { token: newToken, user: userData } = normalizeAuthPayload(
                response.data as Record<string, unknown>
            );

            // Only store if data is valid (always camelCase for the rest of the app)
            if (newToken && newToken !== 'undefined') {
                sessionStorage.setItem('token', newToken);
            }
            if (userData) {
                sessionStorage.setItem('user', JSON.stringify(userData));
            }

            setToken(newToken);
            setUser(userData);

            toast.success(`Welcome back, ${userData?.fullName ?? 'there'}!`);
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