// src/api/cv.js
import apiClient from './axios';

export const getAllCv = () => {
    return apiClient.get('/cvs');
};

export const getCv = (cvId) => {
    return apiClient.get(`/cvs/${cvId}`);
};

export const createCv = (payload) => {
    return apiClient.post('/cvs', payload);
};

export const updateCv = (cvId, payload) => {
    return apiClient.put(`/cvs/${cvId}`, payload);
};

export const deleteCv = (cvId) => {
    return apiClient.delete(`/cvs/${cvId}`);
};