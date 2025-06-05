

import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const authApi = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const createApiInstance = (endpoint: string) => {
  const instance = axios.create({
    baseURL: `${API_URL}/api/${endpoint}`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await authApi.get("/refresh-token");
          const newAccessToken = response.data.token;

          localStorage.setItem("token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest); 
        } catch (refreshError) {
          localStorage.removeItem("token");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const userApi = createApiInstance("user");
export const ownerApi = createApiInstance("owner");
export const adminApi = createApiInstance("admin");
