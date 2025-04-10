import { IProperty } from "../../types/IProperty";
import { adminApi } from "../api";

export const adminService={
    getDashboardStats: async () => {
      const response = await adminApi.get("/dashboard");
      return response.data;
    },
    listAllUsers: async () => {
      const response = await adminApi.get("/users");
      return response.data;
    },
    listAllBookings: async () => {
      console.log("bookings")
      const response = await adminApi.get("/bookings");
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
    updateFeature:async(id:string,newFeature:string)=>{
      const response = await adminApi.patch(`/features/${id}`, { data: newFeature });
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
     getAllProperties: async (): Promise<IProperty> => {
          console.log("from api");
          const response = await adminApi.get("/all-Properties");
          return response.data;
        },

        approveProperty: async (id: string) => {
          const response = await adminApi.patch(`/properties/approve/${id}`);
          return response.data;
        },
        blockUnblockProperty: async (id: string, newStatus: string) => {
          const response = await adminApi.patch(`/properties/status/${id}`, { status: newStatus });
          return response.data;
        },
        deleteProperty: async (id: string) => {
          const response = await adminApi.delete(`/properties/${id}`);
          return response.data;
        },
                        
  
  }