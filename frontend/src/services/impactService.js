import api from './api';

export const getImpactStats = () => api.get('/api/impact/stats');
