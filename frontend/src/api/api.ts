import axios from "axios";



const API_URL = import.meta.env.VITE_BACKEND_URL;

const createApiInstance = (endpoint: string) => {
  const instance = axios.create({
    baseURL: `${API_URL}/api/${endpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
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
          await instance.post("/refresh-token");
          return instance(originalRequest);
        } catch (refreshError) {
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
