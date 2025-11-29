import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

// JWT Token otomatik ekleme
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Global error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error?.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
