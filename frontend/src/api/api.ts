import axios from "axios";
import { create } from "zustand";

// API URL from environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Axios Instances for Different User Roles
export const userApi = axios.create({
  baseURL: `${API_URL}/api/user`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const ownerApi = axios.create({
  baseURL: `${API_URL}/api/owner`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Auth Store Using Zustand
interface AuthState {
  user: any | null; 
  isLoading: boolean;
  verifyOtp: (data: { otp: string; email: string }) => Promise<any>;
  OwnerverifyOtp: (data: { otp: string; email: string }) => Promise<any>;

  resendOtp: (data: { email: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  verifyOtp: async ({ otp, email }) => {
    try {
      set({ isLoading: true });
      const response = await userApi.post("/verify-otp", { otp, email });
      set({ user: response.data.user, isLoading: false });
      return response.data; 
    } catch (error) {
      set({ isLoading: false });
      throw error; 
    }
  },

  resendOtp: async ({ email }) => {
    try {
      console.log(email,'resend otp email')
      set({ isLoading: true });
      await userApi.post("/resend-otp", { email });
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error; 
    }
  },

  logout: () => set({ user: null }),

  OwnerverifyOtp: async ({ otp, email }) => {
    try {
      set({ isLoading: true });
      console.log(email,"route")
      const response = await ownerApi.post("/verify-otp", { otp, email });
      set({ user: response.data.user, isLoading: false });
      return response.data; 
    } catch (error) {
      set({ isLoading: false });
      throw error; 
    }
  },
}));



// Auth Service for API Calls
export const authService = {
  // User API
  userSignup: async (userData: any) => {
    const response = await userApi.post("/signup", userData);
    return response.data;
  },
  userLogin: async (credentials: { email: string; password: string }) => {
    const response = await userApi.post("/login", credentials);
    return response.data;
  },
  userVerifyOtp: async (data: { email: string; otp: string }) => {
    const response = await userApi.post("/verify-otp", data);
    return response.data;
  },
  userLogout: async () => {
    const response = await userApi.post("/logout");
    return response.data;
  },
  userForgotPassword:async()=>{
    const response = await userApi.post("/forgot-pass");
    return response.data;
  },

// owner api is here to
  ownerSignup: async (ownerData: any) => {
    console.log("signuupp")
    const response = await ownerApi.post("/signup", ownerData);
    return response.data;
  },
  ownerLogin: async (credentials: { email: string; password: string }) => {
    const response = await ownerApi.post("/login", credentials);
    return response.data;
  },
  ownerVerifyOtp: async (data: { email: string; otp: string }) => {
    const response = await ownerApi.post("/verify-otp", data);
    return response.data;
  },
  ownerLogout: async () => {
    const response = await ownerApi.post("/logout");
    return response.data;
  },

  // Admin API
  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await adminApi.post("/login", credentials);
    return response.data;
  },
  adminLogout: async () => {
    const response = await adminApi.post("/logout");
    return response.data;
  },
};
