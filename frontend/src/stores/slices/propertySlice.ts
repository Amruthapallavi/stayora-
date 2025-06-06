import { StateCreator } from 'zustand';
import { AppState } from '../../types/storeTypes';
import { propertyState } from '../../types/storeTypes';
import { ownerService } from '../../api/services/ownerService';
import { userService } from '../../api/services/userService';
import { adminService } from '../../api/services/adminService';

export const createPropertySlice: StateCreator<AppState, [], [], propertyState> = (_set, get) => ({
  
       getProperties: async (page:number,limit:number,searchTerm:string) => {
          try {
            const { authType } = get();
            if (!authType || authType !== "owner")
              throw new Error("Not authorized as owner");
  
            return await ownerService.getProperties(page,limit,searchTerm);
          } catch (error) {
            console.error("Failed to list properties", error);
            throw error;
          }
        },
  
    filteredProperties: async (data: any) => {
         const { authType } = get();
         if (!authType) return false;
 
         try {
           let response;
           switch (authType) {
             case "user":
               response = await userService.filteredProperties(data);
               break;
             case "owner":
               break;
             default:
               return false;
           }
           return response;
         } catch (error) {
           console.error("Error checking user status", error);
           return false;
         }
       },
         updateProperty: async (propertyId: string,formData:any) => {
               try {
                 const { authType } = get();
                 if (!authType || authType !== "owner")
                   throw new Error("Not authorized");
       
                 return await ownerService.updateProperty(propertyId,formData);
               } catch (error) {
                 console.error("Failed to list owners", error);
                 throw error;
               }
             },
                addProperty: async (propertyData) => {
                     try {
                       const { authType } = get();
                       if (!authType || authType !== "owner")
                         throw new Error("Not authorized as owner");
             
                       return await ownerService.addProperty(propertyData);
                     } catch (error) {
                       console.error("Error adding property:", error);
                     }
                   },
                       deleteProperty: async (propertyId) => {
                           try {
                             const { authType } = get();
                             if (!authType || authType !== "admin")
                               throw new Error("Not authorized as admin");
                             return await adminService.deleteProperty(propertyId);
                           } catch (error) {
                             console.error("Failed to delete property", error);
                             throw error;
                           }
                         },
                         deletePropertyById: async (propertyId: string) => {
                           try {
                             const { authType } = get();
                             if (!authType || authType !== "owner")
                               throw new Error("Not authorized");
                             return await ownerService.deletePropertyById(propertyId);
                           } catch (error) {
                             console.error("Failed to delete property", error);
                             throw error;
                           }
                         },
                         blockUnblockProperty: async (propertyId, newStatus) => {
                           try {
                             const { authType } = get();
                             if (!authType || authType !== "admin")
                               throw new Error("Not authorized as admin");
                             return await adminService.blockUnblockProperty(propertyId, newStatus);
                           } catch (error) {
                             console.error("Failed to update property status", error);
                             throw error;
                           }
                         },
                         approveProperty: async (propertyId) => {
                           try {
                             const { authType } = get();
                             if (!authType || authType !== "admin")
                               throw new Error("Not authorized as admin");
                             return await adminService.approveProperty(propertyId);
                           } catch (error) {
                             console.error("Failed to approve property", error);
                             throw error;
                           }
                         },
                            rejectProperty: async (id, reason) => {
        try {
          const { authType } = get();
          if (!authType) throw new Error("Not authorized as admin");
          return await adminService.rejectProperty(id, reason);
        } catch (error) {
          console.error("rejecting property failed", error);
          throw error;
        }
      },
      
            getPropertyById: async (propertyId: string) => {
              try {
                const { authType } = get();
      
                if (!authType) {
                  throw new Error("Not authorized");
                }
               let response;
                if (authType === "user") {
                 response=  await userService.getPropertyById(propertyId);
                 return response;
                }
      
                if (authType === "owner") {
                  return await ownerService.getPropertyById(propertyId);
                }
      
                if (authType === "admin") {
                  return await adminService.getPropertyById(propertyId);
                }
      
                throw new Error("Unknown role");
              } catch (error) {
                console.error("Failed to fetch property:", error);
                throw error;
              }
            },
             locationProperties: async () => {
                   try {
                      const { authType } = get();
                         if (!authType || authType !== "user")
                               throw new Error("Not authorized as user");
                             return await userService.locationProperties();
                           } catch (error) {
                             console.error("Failed to fetch property", error);
                             throw error;
                           }
                         },
        getReviews: async (propertyId: string) => {
              try {
                const { authType } = get();
      
                if (!authType) {
                  throw new Error("Not authorized");
                }
               let response;
                if (authType === "user") {
                 response=  await userService.getReviews(propertyId);
                 return response;
                }
      
                if (authType === "owner") {
                  return await ownerService.getReviews(propertyId);
                }
      
                if (authType === "admin") {
                  return await adminService.getReviews(propertyId);
                }
      
                throw new Error("Unknown role");
              } catch (error) {
                console.error("Failed to fetch property:", error);
                throw error;
              }
            },
            getAllProperties: async (page: number, limit: number,search?:string) => {
              try {
                const { authType } = get();
      
                if (!authType) throw new Error("Not authorized");
      
                if (authType === "user") {
                  return await userService.getAllProperties(page,limit);
                }
      
                if (authType === "admin") {
               return await adminService.getAllProperties(page, limit, search || "");
                }
      
                throw new Error("Invalid authType");
              } catch (error) {
                console.error("Failed to fetch properties", error);
                throw error;
              }
            },

            submitReview:async (bookingId:string,reviewRate:number,reviewText:string)=>{
              try {
                 const { authType } = get();
      
                if (!authType || authType!=="user") throw new Error("Not authorized");
      
                  const response= await userService.submitReview(bookingId,reviewRate,reviewText);
                  return response;
              } catch (error) {
                console.error("Failed to fetch properties", error);
                throw error;
              }
            }
       
});
