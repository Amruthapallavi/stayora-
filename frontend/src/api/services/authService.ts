import { IOwner } from "../../types/owner";
import { adminApi, ownerApi, userApi } from "../api";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const authService = {
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
  userResendOtp: async (email: string) => {
    const response = await userApi.post("/resend-otp", { email }, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;

  },
  getUserById: async (id: string) => {
    if (!id) throw new Error("User ID is required");
    try {
      const response = await userApi.get(`/check-status/${id}`);
      return response.data;
    } catch (error) {
      console.error(" Error fetching user status:", error);
      throw error;
    }
  },
  
  getOwnerById: async (id: string) => {
    if (!id) throw new Error("Owner ID is required");
    try {
      const response = await ownerApi.get(`/check-status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching owner status:", error);
      throw error;
    }
  },
  
  userLogout: async () => {
    const response = await userApi.post("/logout");
    return response.data;
  },
  userForgotPassword:async(email:any)=>{
    const response = await userApi.post("/forgot-pass",email);
    return response.data;
  },
  userResetPassword :async (data:{email:string,newPassword:string})=>{
    const response = await userApi.post("/reset-password",data);
    return response.data;
  },
    subscribe :async (planName:string,price:number,allowedProperties:number)=>{
    const response = await ownerApi.post("/subscription",{planName,price,allowedProperties});
    return response.data;
  },
  verifySubscription:async(paymentData:any)=>{
  const response = await ownerApi.post("/verify-subscription",{paymentData});
    return response.data;
  },
  getGoogleAuthUrl: () => {
    return `${API_URL}/api/user/auth/google`;
  },
 

  ownerSignup: async (ownerData: any) => {
    const response = await ownerApi.post("/signup", ownerData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  ownerLogin: async (credentials: { email: string; password: string }) => {
    const response = await ownerApi.post("/login", credentials);
    return response.data;
  },
  getOwnerData: async (id:string):Promise<{ user: IOwner }> => {
    const response = await ownerApi.get(`/profile/${id}`);
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
  ownerResendOtp: async (email: string) => {
    const response = await ownerApi.post("/resend-otp", { email }, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;

  },
  OwnerForgotPassword:async(email:any)=>{
    const response = await ownerApi.post("/forgot-pass",email);
    return response.data;
  },
  ownerResetPassword :async (data:{email:string,newPassword:string})=>{
    const response = await ownerApi.post("/reset-password",data);
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