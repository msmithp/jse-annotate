import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use(
    config => {
        const access = localStorage.getItem("access");
        if (access) {
            config.headers['Authorization'] = `Bearer ${access}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,  // No action necessary if response is valid
    async error => {
        // Error 401 indicates unauthorized access
        if (error.response?.status === 401) {
            try {
                // Get refresh token
                const refresh = localStorage.getItem("refresh");

                // API call to back-end to get new access token
                const res = await axios.post(
                    "http://127.0.0.1:8000/token/refresh/",
                    { refresh },
                    { headers: { "Content-Type": "application/json" } },
                );

                if (res.status === 200) {
                    // Request was successful
                    error.config.headers["Authorization"] = `Bearer ${res.data.access}`;
                    
                    // Store new tokens
                    localStorage.setItem("access", res.data.access);
                    localStorage.setItem("refresh", res.data.refresh);

                    // Retry the failed request with updated Authorization header
                    return axios(error.config);
                } else {
                    return Promise.reject(error);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
)

export default axiosInstance;
