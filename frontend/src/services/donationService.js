import api from './api';

export const getDonations = (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') params.append(key, val);
    });
    return api.get(`/api/donations?${params.toString()}`);
};

export const createDonation = (donationData) => api.post('/api/donations', donationData);

export const getDonation = (id) => api.get(`/api/donations/${id}`);

export const claimDonation = (id) => api.put(`/api/donations/${id}/claim`);

export const completeDonation = (id) => api.put(`/api/donations/${id}/complete`);

export const getMyDonations = () => api.get('/api/donations/my');

export const deleteDonation = (id) => api.delete(`/api/donations/${id}`);
