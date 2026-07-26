import axios from 'axios';


const apiClient = axios.create({
    baseURL: "http://localhost:3002"
}) 

apiClient.interceptors.response.use(res => res, err => {
    if (err.response?.status === 401){
        /* stub */
    }
    return Promise.reject(err);
})


export default apiClient;
