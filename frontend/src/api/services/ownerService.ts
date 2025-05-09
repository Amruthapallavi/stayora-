// import axios from "axios";

import { IOwner } from "../../types/IOwner";
import { ownerApi } from "../api";

export const ownerService = {


  updateOwner: async <T>(id: string, formData: Partial<T> | IOwner) => {
    console.log(formData,"fromapi")
      const response = await ownerApi.patch(`/profile/${id}`, { data: formData });
        return response.data;
      },
      listFeatures:async()=>{
        const response = await ownerApi.get("/features");
        return response.data;
      },
      listAllBookings:async(ownerId:string)=>{
         const response= await ownerApi.get("/bookings",{params: { ownerId },
         });
         return response.data;
      },
      getDashboardData:async ()=>{
     const response = await ownerApi.get("/dashboard");
     return response.data;
      },
      addProperty: async (propertyData: any) => {
        console.log("adding property from api", propertyData);
    
        const response = await ownerApi.post("/add-property", propertyData, {
          
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data;
      },
          getConversation: async (sender: string, receiver: string):Promise<any> => {
              const response = await ownerApi.get("/conversation", {
                params: { sender, receiver },
              });
              console.log(response,"from api for chat")
              return response.data;
            
          },
          markMessageAsRead: async (convId: string, userId: string):Promise<any> => {
                const response = await ownerApi.patch("/messages/mark-as-read", 
                 {params: { convId, userId },}
                );
                return response.data;
              
            },
      updateProperty:async(id:string,formData:any)=>{
           const response=await ownerApi.patch(`/property/update/${id}`,formData);
           return response.data;
      },
      getProperties:async()=>{
        const response = await ownerApi.get("/get-Owner-Properties");
        return response.data;
      },
      deletePropertyById:async(id:string)=>{
  const response = await ownerApi.delete(`/delete/${id}`);
  return response.data;
      },
      getOwnerBookings: async (page: number = 1, limit: number = 5): Promise<any> => {
             console.log("from api");
             const response = await ownerApi.get(`/bookings?page=${page}&limit=${limit}`);
             return response.data;
           },
            getPropertyById:async(id:string):Promise<void>=>{
                   console.log(id,"proprtyDetails");
                   const response = await ownerApi(`/property/${id}`);
                   return response.data;
               },
               bookingDetails:async(id:string):Promise<void>=>{
                   const response = await ownerApi(`/bookings/${id}`);
                   return response.data;
               },
                 fetchWalletData:async(id:string):Promise<void>=>{
                     const response = await ownerApi.get(`/wallet/${id}`);
                     console.log(response)
                     return response.data;
                 },
                  listConversations: async ():Promise<any[]> => {
                       const response = await ownerApi.get("/conversations", {
                       });
                       console.log(response,"from mpl")
                       return response.data.data;
                     
                   },
                      sendMessage:async (data: {
                               userId: string;
                               receiverId: string;
                               propertyId: string;
                               content: string;
                               room:any;
                             }) => {
                               const res = await ownerApi.post('/message', data);
                               return res.data;
                             },
      
  }