import apiClient from './axios';

export const getAllJobApplications = () => {
    return apiClient.get('/job-tracker');
};

export const getJobApplicationsByStatus = () => {
    return apiClient.get('/job-tracker/by-status');
};

export const getJobApplicationStats = () => {
    return apiClient.get('/job-tracker/stats');
};

export const getJobApplication = (id) => {
    return apiClient.get(`/job-tracker/${id}`);
};

export const createJobApplication = (payload) => {
    return apiClient.post('/job-tracker', payload);
};

export const updateJobApplication = (id, payload) => {
    return apiClient.put(`/job-tracker/${id}`, payload);
};

export const updateJobApplicationStatus = (id, status) => {
    return apiClient.patch(`/job-tracker/${id}/status`, { status });
};

export const deleteJobApplication = (id) => {
    return apiClient.delete(`/job-tracker/${id}`);
};
