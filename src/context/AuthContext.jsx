import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token && email) {
            setUser({ email, token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login(email, password);
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        setUser({ email, token });
    };

    const register = async (email, password) => {
        const response = await authAPI.register(email, password);
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        setUser({ email, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);