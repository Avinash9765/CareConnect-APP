import api from './api';

export const getEvents = (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    return api.get(`/api/events?${params.toString()}`);
};

export const getEvent = (id) => api.get(`/api/events/${id}`);

export const createEvent = (eventData) => api.post('/api/events', eventData);

export const registerForEvent = (id) => api.post(`/api/events/${id}/register`);

export const unregisterFromEvent = (id) => api.delete(`/api/events/${id}/unregister`);

export const getMyRegisteredEvents = () => api.get('/api/events/my-registered');
