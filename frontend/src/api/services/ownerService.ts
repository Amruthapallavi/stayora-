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
      listAllBookings:async(id:string)=>{
         const response= await ownerApi.get(`/bookings/${id}`);
         return response.data;
      },
      addProperty: async (propertyData: any) => {
        console.log("adding property from api", propertyData);
    
        const response = await ownerApi.post("/add-property", propertyData, {
          
            headers: { "Content-Type": "multipart/form-data" },
          });
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
      
  }