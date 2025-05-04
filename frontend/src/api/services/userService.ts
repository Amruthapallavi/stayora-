import { userApi } from "../api";
import { IUser } from "../../types/user.interface";

// import axios from "axios";

export const userService = {

    getAllProperties: async (): Promise<any> => {
      console.log("from api");
      const response = await userApi.get("/all-Properties");
      return response.data;
    },
    getPropertyById:async(id:string):Promise<void>=>{
        console.log(id,"proprtyDetails");
        const response = await userApi.get(`/property/${id}`);
        return response.data;
    },
     filteredProperties :async (data: any): Promise<any> => {
      console.log(data, "filtered");
    
      // Construct the query string from the data object
      const queryParams = new URLSearchParams(data).toString();
    
      // Send the request with query parameters
      const response = await userApi.get(`/property/filtered?${queryParams}`);
      return response.data;
    },
    
    getConversation: async (sender: string, receiver: string):Promise<any> => {
        const response = await userApi.get("/conversation", {
          params: { sender, receiver },
        });
        return response.data;
      
    },
    markMessageAsRead: async (convId: string, userId: string):Promise<any> => {
      const response = await userApi.patch("/messages/mark-as-read", 
       {params: { convId, userId },}
      );
      return response.data;
    
  },
    listConversations: async ():Promise<any[]> => {
      const response = await userApi.get("/conversations", {
      });
      return response.data.data;
    
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
    fetchWalletData:async(id:string):Promise<void>=>{
      const response = await userApi.get(`/wallet/${id}`);
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
         
          sendMessage:async (data: {
            userId: string;
            receiverId: string;
            propertyId: string;
            content: string;
            room:any;
          }) => {
            const res = await userApi.post('/message', data);
            return res.data;
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
      bookingDetails:async(id:string):Promise<void>=>{
                       const response = await userApi.get(`bookings/${id}`);
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
      const response = await userApi.get(`/profile/${id}`);
      return response.data;
    },
    cancelBooking: async (id: string,reason:string): Promise<any> => {
      console.log("data passing");
      const response = await userApi.post(`/bookings/cancel/${id}`,{reason});
      console.log(response,"from api")
      return response.data;
    },
  
  };