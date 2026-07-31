import axios, { AxiosInstance, AxiosError } from 'axios';
import * as authHelpers from "../lib/auth.js";

const BASE_URL = "http://localhost:3002"


// creates an axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: "http://localhost:3002",
    headers: {
        "Content-Type": "application/json"
    }
}); 

// Request interceptor 
apiClient.interceptors.request.use((config) => {
    const token = authHelpers.getAccessToken();
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},
(error) => {
    return Promise.reject(error)
})



// Response interceptor - 401 error (token expired) and refresh token
apiClient.interceptors.response.use((response) => {
    return response;
    }, 
    async(error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && (!originalRequest.headers['X-Retry'])){
            try{
                const refreshToken = authHelpers.getRefreshToken();
                if (!refreshToken){
                    authHelpers.clearAccessToken();
                    authHelpers.clearRefreshToken();
                    window.location.href = "/login";
                    return Promise.reject(error);
                }
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {currToken: refreshToken});
                authHelpers.setAccessToken(response.data.data.accessToken);
                authHelpers.setRefreshToken(response.data.data.refreshToken);

                // prevent retry
                originalRequest.headers["X-Retry"] = true;
                originalRequest.headers.Authorization = `Bearer ${response.data.data.refreshToken}`

                return apiClient(originalRequest)
            }
            catch(refreshError){
                authHelpers.clearAccessToken();
                authHelpers.clearRefreshToken();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    
})


export const apiRequest = {
    get: async <T>(url: string, config = {}) => {
        const response = await apiClient.get<T>(url, config)
        return response.data;
    },
    post: async <T>(url:string, data = {}, config = {}) => {
        const response = await apiClient.post<T>(url, data, config);
        return response.data;
    },
    patch: async <T>(url:string, data= {}, config={}) => {
        const response = await apiClient.patch<T>(url, data, config);
        return response.data;
    },
    delete: async <T>(url:string, config={}) => {
        const response = await apiClient.delete<T>(url, config);
        return response.data;
    }
}
