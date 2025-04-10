import axios from "axios";
// import { IUser } from "../types/user.interface";
// import { IOwner } from "../types/IOwner";

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

  return instance;
};


export const userApi = createApiInstance("user");
export const ownerApi = createApiInstance("owner");
export const adminApi = createApiInstance("admin");









