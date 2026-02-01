import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api" // TÜM endpointler buraya bağlı
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // DOĞRU KEY
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

//  Global error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
