import { userApi } from "../api";
import { IUser } from "../../types/user.interface";

import axios from "axios";

export const userService = {

    getAllProperties: async (): Promise<any> => {
      console.log("from api");
      const response = await userApi.get("/all-Properties");
      return response.data;
    },
    getPropertyById:async(id:string):Promise<void>=>{
        console.log(id,"proprtyDetails");
        const response = await userApi(`/property/${id}`);
        return response.data;
    },
    saveBookingDates: async (
      moveInDate: Date,
      rentalPeriod: number,
      endDate: Date,
      propertyId:string,
    ): Promise<void> => {
      const response = await userApi.post("/checkout/save-booking-dates", {
        moveInDate,
        rentalPeriod,
        endDate,propertyId
      });
      return response.data;
    },
  
    saveAddOns: async (addOns: string[],propertyId:string): Promise<void> => {
      const response = await userApi.post("/checkout/save-addons", { addOns ,propertyId});
      return response.data;
    },
    getUserBookings: async (page: number = 1, limit: number = 5): Promise<any> => {
      console.log("from api");
      const response = await userApi.get(`/bookings?page=${page}&limit=${limit}`);
      return response.data;
    },
      updateuser:async(id:string,formData:IUser)=>{
          console.log(formData,"fromapi")
          const response = await userApi.patch(`/profile/${id}`, { data: formData });
            return response.data;
          },
    
  
    getCartDetails: async (id:string): Promise<any> => {
      const response = await userApi.get(`/checkout/${id}`);
      return response.data;
    },
    changePassword: async (data: { userId: string; oldPass: string; newPass: string }): Promise<any> => {
      const response = await userApi.patch(`/change-password/${data.userId}`, {
        oldPassword: data.oldPass,
        newPassword: data.newPass,
      });
    
      return response.data;
    },
    
  
    clearCart: async (): Promise<void> => {
      const response = await userApi.delete("/cart/clear");
      return response.data;
    },
    listServices:async(): Promise<void>=>{
      const response = await userApi.get("/services");
      return response.data;
    },
    getUserData: async (id: string): Promise<{ user: IUser }> => {
      console.log("data passing");
      const res = await userApi.get(`/profile/${id}`);
      return res.data;
    },
  
  };