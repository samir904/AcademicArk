import axios from "axios";

//const base_url="http://localhost:5014/api/v1"
const base_url="https://academicark.onrender.com/api/v1"

const axiosInstance=axios.create();
axiosInstance.defaults.baseURL=base_url;
axiosInstance.defaults.withCredentials=true;
// ✨ NEW: Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        // If token exists, add to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✨ NEW: Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 Unauthorized, redirect to login
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            
            // Don't redirect if already on login/signup pages
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                // Clear auth data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('data');
                localStorage.removeItem('role');
                localStorage.removeItem('authToken');
                
                // Redirect to login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;