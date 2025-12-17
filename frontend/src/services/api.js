import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
    (config) => {
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

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // Optionally redirect to login
            if (window.location.pathname !== '/') {
                // Don't redirect if already on home
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper functions for common API calls
export const foodAPI = {
    getAll: (category) => api.get('/food/list', { params: { category } }),
    getById: (id) => api.get(`/food/${id}`),
    getCategories: () => api.get('/food/categories')
};

export const orderAPI = {
    create: (orderData) => api.post('/order/create', orderData),
    verify: (orderId, success) => api.post('/order/verify', { orderId, success }),
    getMyOrders: () => api.get('/order/my-orders'),
    getById: (id) => api.get(`/order/${id}`)
};
