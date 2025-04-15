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

/**
 * Response interceptor code based on:
 * https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
 */
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string | null) => void,
    reject: (err: any) => void
}> = [];

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    })

    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    response => response,  // No action necessary if response is valid
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Another request has already started refreshing the token
                return new Promise((resolve, reject) => {
                    // Enqueue request with its resolve and reject functions
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                })
            }

            // Mark request as having been retried to avoid infinite loop
            originalRequest._retry = true;

            // Signal that refresh process has begun to avoid race conditions
            isRefreshing = true;

            const refresh = localStorage.getItem("refresh");
            return new Promise((resolve, reject) => {
                // API call to back-end to get new access token with current refresh token
                axios.post("http://127.0.0.1:8000/token/refresh/", { refresh: refresh })
                    .then(res => {
                        // Successful response, set new tokens
                        const newAccess = res.data.access;
                        const newRefresh = res.data.refresh;

                        localStorage.setItem("access", newAccess);
                        localStorage.setItem("refresh", newRefresh);
                        
                        // Update headers for all future requests
                        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;

                        // Update headers for original failed request
                        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

                        // Retry all failed requests in queue
                        processQueue(null, newAccess);

                        // Retry original request
                        resolve(axios(originalRequest));
                    })
                    .catch((err) => {
                        // Reject all queued requests
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        // Done processing, set refreshing to false
                        isRefreshing = false 
                    });
            })
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
