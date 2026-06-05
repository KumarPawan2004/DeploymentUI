import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: 'User' | 'Admin') => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data) {
                    const userData = response.data;
                    setUser({
                        id: String(userData.id ?? userData.Id ?? ''),
                        fullName: userData.fullName ?? userData.FullName ?? '',
                        email: userData.email ?? userData.Email ?? '',
                        role: userData.role ?? userData.Role ?? 'User',
                        isBlocked: Boolean(userData.isBlocked ?? userData.IsBlocked)
                    });
                }
            } catch (error) {
                // Not logged in or token expired
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string, role: 'User' | 'Admin') => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password,
                role
            });

            if (response.data && response.data.user) {
                if (response.data.token) {
                    sessionStorage.setItem('token', response.data.token);
                }
                
                const userData = response.data.user;
                setUser({
                    id: String(userData.id ?? userData.Id ?? ''),
                    fullName: userData.fullName ?? userData.FullName ?? '',
                    email: userData.email ?? userData.Email ?? '',
                    role: userData.role ?? userData.Role ?? 'User',
                    isBlocked: Boolean(userData.isBlocked ?? userData.IsBlocked)
                });
                toast.success(`Welcome back, ${userData?.fullName ?? 'there'}!`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout request failed', error);
        } finally {
            setUser(null);
            toast.success('Logged out successfully');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};