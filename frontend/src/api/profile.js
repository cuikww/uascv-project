import apiClient from './axios';

export const getMasterProfile = () => {
    return apiClient.get('/profiles');
}
export const saveMasterProfile = (data) => {
    return apiClient.put('/profiles', data);
};