import apiClient from './axios';

// Get all job applications
export const getAllJobApplications = () => {
    return apiClient.get('/job-tracker');
};

// Get job applications grouped by status
export const getJobApplicationsByStatus = () => {
    return apiClient.get('/job-tracker/by-status');
};

// Get statistics
export const getJobApplicationStats = () => {
    return apiClient.get('/job-tracker/stats');
};

// Get single job application
export const getJobApplication = (id) => {
    return apiClient.get(`/job-tracker/${id}`);
};

// Create new job application
export const createJobApplication = (payload) => {
    return apiClient.post('/job-tracker', payload);
};

// Update job application
export const updateJobApplication = (id, payload) => {
    return apiClient.put(`/job-tracker/${id}`, payload);
};

// Update job application status
export const updateJobApplicationStatus = (id, status) => {
    return apiClient.patch(`/job-tracker/${id}/status`, { status });
};

// Delete job application
export const deleteJobApplication = (id) => {
    return apiClient.delete(`/job-tracker/${id}`);
};
