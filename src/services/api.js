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

// Tokens are now handled automatically via HttpOnly cookies by the browser,
// so we no longer need to manually inject the Authorization header.
api.interceptors.request.use((config) => {
    return config;
});

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            toast.error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default api;











