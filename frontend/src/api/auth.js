import apiClient from "./axios";

export const register = (payload) => {
    return apiClient.post("/auth/register", payload);
};

export const login = (payload) => {
    return apiClient.post("/auth/login", payload);
};