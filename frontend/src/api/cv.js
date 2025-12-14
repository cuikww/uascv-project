import apiClient from './axios';

export const getCv = (cvId) => {
  return apiClient.get(`/onboarding/cv/${cvId}`);
};

export const getAllCv = () => {
  return apiClient.get(`/onboarding/cv`);
};

export const createCv = (payload) => {
  return apiClient.post('/onboarding/cv', payload);
};

export const updateCv = (cvId, payload) => {
  return apiClient.put(`/onboarding/cv/${cvId}`, payload);
};

export const deleteCv = (cvId) => {
  return apiClient.delete(`/onboarding/cv/${cvId}`);
};