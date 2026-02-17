import axios from "axios";

// const base_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5014/api/v1";
const base_url =
  import.meta.env.VITE_BACKEND_URL ||
  "https://academicark.onrender.com/api/v1";

console.log('📡 Axios base URL:', base_url);

const axiosInstance = axios.create({
    baseURL: base_url,
    withCredentials: true,
    timeout: 30000
});

// ✅ Request Interceptor - Add token BEFORE every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        
        // console.log('📤 Request:', config.method.toUpperCase(), config.url);
        // console.log('🔑 Token in storage:', token ? 'YES ✅' : 'NO ❌');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log('✅ Token added to headers');
        } else {
            // console.warn('⚠️ No token found!');
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// ✅ Response Interceptor - Handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.response?.status, error.response?.data?.message);
        
        if (error.response?.status === 401) {
            console.error('🔓 401 Unauthorized - Clearing auth');
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('data');
            localStorage.removeItem('role');
            
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                setTimeout(() => {
                    window.location.href = '/login?reason=session-expired';
                }, 1000);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
