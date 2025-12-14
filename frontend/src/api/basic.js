import apiClient from './axios';

export const getCvBasicInfoById = (cvId) => {
    return apiClient.get(`/basicdetails/${cvId}`);
};

export const insertCvBasicInfo = (cvId, data) => {
    return apiClient.post(`/basicdetails/${cvId}`, data);
};

export const updateCvBasicInfo = (cvId, basicId, data) => {
    return apiClient.post(`/basicdetails/${cvId}/${basicId}`, data);
};