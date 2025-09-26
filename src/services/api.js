import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", 
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Por exemplo: redirecionar para login se o token expirou
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;