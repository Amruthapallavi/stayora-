import axios from "axios";

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
  userResendOtp: async ( email: string) => {
    const response = await userApi.post("/resend-otp", email);
    console.log(response);
    return response.data;
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
  getGoogleAuthUrl: () => {
    return `${API_URL}/api/user/auth/google`;
  },

// owner api is here to
  ownerSignup: async (ownerData: any) => {
    console.log("signuupp")
    const response = await ownerApi.post("/signup", ownerData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
  OwnerResendOtp: async ( email: string) => {
    const response = await ownerApi.post("/resend-otp", email);
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

export const adminService={
  getDashboardStats: async () => {
    const response = await adminApi.get("/dashboard");
    return response.data;
  },
  listAllUsers: async () => {
    const response = await adminApi.get("/users");
    return response.data;
  },
  updateUserStatus:async(id:string,currentStatus:string)=>{
  const response = await adminApi.patch(`/users/status/${id}`, { status: currentStatus });
    return response.data;
  },
  listAllOwners: async () => {
    const response = await adminApi.get("/owners");
    return response.data;
  },
  addService:async (serviceData:any)=>{
    const response = await adminApi.post("/add-service",serviceData);
    return response.data;
  },
  listServices:async()=>{
    const response = await adminApi.get("/services");
    return response.data;
  },
  updateServiceStatus:async(id:string,currentStatus:string)=>{

    const response = await adminApi.patch(`/services/status/${id}`, { status: currentStatus });
    return response.data;
  },
  listFeatures:async()=>{
    const response = await adminApi.get("/features");
    return response.data;
  },
  addFeature:async (featureData:any)=>{
    const response = await adminApi.post("/add-feature",featureData);
    return response.data;
  },
  updateOwnerStatus:async(id:string,currentStatus:string)=>{
    const response = await adminApi.patch(`/owners/status/${id}`, { status: currentStatus });
    return response.data;
  },
  approveOwner:async(id:string)=>{

    const response = await adminApi.patch(`/owners/approve/${id}`);
    return response.data;
  },
  rejectOwner: async (id: string, rejectionReason: string) => {
    const response = await adminApi.patch(`/owners/reject/${id}`, {
      reason: rejectionReason, 
    });
    return response.data;
  },
  
  deleteOwner:async(id:string)=>{

    const response = await adminApi.post(`/owners/delete/${id}`);
    return response.data;
  },
  deleteUser:async(id:string)=>{

    const response = await adminApi.post(`/users/delete/${id}`);
    return response.data;
  },
  removeFeature:async(id:string)=>{

    const response = await adminApi.post(`/features/delete/${id}`);
    return response.data;
  },

}
