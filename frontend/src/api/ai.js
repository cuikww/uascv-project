import apiClient from './axios';

export const generateExperienceDesc = (payload) => {
    return apiClient.post('/ai/experience', payload);
};

export const generateSummary = (payload) => {
    return apiClient.post('/ai/summary', payload);
};

export const generateStyle = (payload) => {
    return apiClient.post('/ai/style', payload);
};