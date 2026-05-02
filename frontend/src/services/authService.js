import api from './api';

export const register = async (userData) => {
    const data = await api.post('/api/auth/register', userData);
    if (data.token) {
        localStorage.setItem('careconnect_token', data.token);
        localStorage.setItem('careconnect_user', JSON.stringify(data.user));
    }
    return data;
};

export const login = async (credentials) => {
    const data = await api.post('/api/auth/login', credentials);
    if (data.token) {
        localStorage.setItem('careconnect_token', data.token);
        localStorage.setItem('careconnect_user', JSON.stringify(data.user));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('careconnect_token');
    localStorage.removeItem('careconnect_user');
    window.location.href = '/login';
};

export const getCurrentUser = () => api.get('/api/auth/me');

export const updateProfile = (profileData) => api.put('/api/auth/profile', profileData);

export const getStoredUser = () => {
    const user = localStorage.getItem('careconnect_user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!localStorage.getItem('careconnect_token');
