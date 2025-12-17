import apiClient from './axios';

export const getMasterData = (section) => {
    return apiClient.get(`/master/${section}`);
};

export const addMasterItem = (section, data) => {
    return apiClient.post(`/master/${section}`, data);
};

export const updateMasterItem = (section, itemId, data) => {
    return apiClient.put(`/master/${section}/${itemId}`, data);
};

export const deleteMasterItem = (section, itemId) => {
    return apiClient.delete(`/master/${section}/${itemId}`);
};