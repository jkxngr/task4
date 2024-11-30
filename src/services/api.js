import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-826989637527.us-central1.run.app/', 
    headers: {
        'Content-Type': 'application/json',
    },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
