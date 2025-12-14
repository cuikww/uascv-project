import apiClient from './axios';

export const getCvBasicInfoById = (cvId) => {
    return apiClient.get(`/onboarding/cv/${cvId}/basic`);
};

export const insertCvBasicInfo = (cvId, data) => {
    return apiClient.post(`/onboarding/cv/${cvId}/basic`, data);
};

export const updateCvBasicInfo = (cvId, basicId, data) => {
    return apiClient.post(`/onboarding/cv/${cvId}/basic/${basicId}`, data);
};