import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('careconnect_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('careconnect_token');
            localStorage.removeItem('careconnect_user');
            window.location.href = '/login';
        }
        const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
        return Promise.reject(new Error(message));
    }
);

export default api;
