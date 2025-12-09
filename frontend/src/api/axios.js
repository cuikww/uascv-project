// frontend/src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // URL Backend Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;