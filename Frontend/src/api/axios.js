import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
     }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
    
export default api;
