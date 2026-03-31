import axios from 'axios';

// Ganti baseURL ini dengan URL backend Django yang dikerjakan Role 1 & 2
const baseURL = 'http://localhost:8000'; 

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Menambahkan token ke header setiap request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Menangani error secara global (misal token expired)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika backend mengembalikan 401 Unauthorized, otomatis logout
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
            window.location.href = '/'; // Arahkan kembali ke halaman utama
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;