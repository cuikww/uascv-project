// src/api/basic.js
import apiClient from './axios';

// Ambil data
export const getCvBasicInfoById = (cvId) => {
    return apiClient.get(`/cv-details/${cvId}`);
};

// Simpan data (Backend pakai Upsert, jadi Insert/Update digabung)
export const saveCvBasicInfo = (cvId, data) => {
    return apiClient.put(`/cv-details/${cvId}`, data);
};