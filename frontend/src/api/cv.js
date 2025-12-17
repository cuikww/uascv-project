import apiClient from './axios';

export const getAllCv = () => {
    return apiClient.get('/cvs');
};


export const createCv = (payload) => {
    return apiClient.post('/cvs', payload);
};

export const updateCvMetadata = (cvId, payload) => {
    return apiClient.put(`/cvs/${cvId}`, payload);
};

export const deleteCv = (cvId) => {
    return apiClient.delete(`/cvs/${cvId}`);
};

export const getCvFullContent = (cvId) => {
    return apiClient.get(`/cvs/${cvId}/full`);
};

export const toggleItemInCv = (cvId, section, itemId) => {
    return apiClient.post(`/cvs/${cvId}/toggle`, { section, itemId });
};