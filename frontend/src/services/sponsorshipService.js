import api from './api';

export const getChildProfiles = () => api.get('/api/sponsorship/children');

export const createSponsorship = (data) => api.post('/api/sponsorship', data);

export const getMySponsorships = () => api.get('/api/sponsorship/my');

export const pauseSponsorship = (id) => api.put(`/api/sponsorship/${id}/pause`);

export const endSponsorship = (id) => api.put(`/api/sponsorship/${id}/end`);
