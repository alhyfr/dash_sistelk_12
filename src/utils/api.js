import axios from "axios";

// Create axios instance
const api = axios.create({
    // baseURL: "http://localhost:3005",
    baseURL: "https://rest1.sistelk.id",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor - add token to headers
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 - clear token and redirect
        if (error.response?.status === 401) {
            // Jangan redirect jika sudah di halaman login untuk menghindari infinite loop
            const currentPath = window.location.pathname;
            if (currentPath === '/login' || currentPath.startsWith('/login')) {
                // Hanya clear token, jangan redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                return Promise.reject(error);
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Clear cookies
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);

export default api;

