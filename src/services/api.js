import axios from 'axios';
import toast from 'react-hot-toast';

// Automatically detect environment to avoid hardcoding IP addresses
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001/api' // local
    : '/api';                     // production (proxied by Nginx)

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// We use HttpOnly cookies primarily, but we add a fallback to sessionStorage/localStorage
// for strict CORS/proxy environments where cookies might be dropped by the browser.
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            toast.error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 401 && !error.config?.url?.includes('/auth/me')) {
            // Only trigger session expired redirect if it wasn't the initial /auth/me check
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default api;











