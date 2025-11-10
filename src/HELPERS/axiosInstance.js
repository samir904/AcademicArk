import axios from "axios";

const base_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5014/api/v1";

const axiosInstance = axios.create({
    baseURL: base_url,
    withCredentials: true,
    timeout: 10000
});

// ✅ Response Interceptor - Only redirect if actually logged in
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // ✅ Check if user thinks they're logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            // Only redirect if user THOUGHT they were logged in
            if (isLoggedIn) {
                console.warn('⚠️ Session expired. Logging out...');
                
                // Clear auth
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("data");
                localStorage.removeItem("role");
                sessionStorage.removeItem('googleAuthStarted');
                sessionStorage.removeItem('googleAuthInitiated');
                localStorage.removeItem('currentSemester');
                
                // Redirect to login only if not already there
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    setTimeout(() => {
                        window.location.href = '/login?reason=session-expired';
                    }, 300);
                }
            }
            // If not logged in, just reject - don't redirect
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
