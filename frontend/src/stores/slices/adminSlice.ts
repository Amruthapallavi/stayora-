import { StateCreator } from 'zustand';
import { AppState } from '../../types/storeTypes';
import { adminState } from '../../types/storeTypes';
import { adminService } from '../../api/services/adminService';
import { ownerService } from '../../api/services/ownerService';
import { authService } from '../../api/services/authService';
import { userService } from '../../api/services/userService';

export const createAdminSlice: StateCreator<AppState, [], [], adminState> = (_set, get) => ({


     getDashboardData: async () => {
            try {
              const { isAuthenticated, authType } = get();
    
              if (!isAuthenticated || !authType) {
                throw new Error("Authentication required");
              }
    
              let response;
    
              switch (authType) {
                case "admin":
                  response = await adminService.getDashboardData();
                  break;
                case "owner":
                  response = await ownerService.getDashboardData();
                  break;
                default:
                  throw new Error("Invalid authentication type");
              }
              return response;
            } catch (error) {
              console.error("Failed to get conversation", error);
              throw error;
            }
          },
    
          getUserStatus: async (userId: string) => {
            const { authType } = get();
            if (!authType) return false;
    
            try {
              let response;
              switch (authType) {
                case "user":
                  response = await authService.getUserById(userId);
                  break;
                case "owner":
                  response = await authService.getOwnerById(userId);
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
    
          getUserData: async (userId: string, authType: string) => {
            try {
              let response;
    
              switch (authType) {
                case "user":
                  response = await userService.getUserData(userId);
                  break;
                case "owner":
                  response = await authService.getOwnerData(userId);
                  break;
                case "admin":
                  // response = await authService.adminForgotPassword({ email });
                  break;
                default:
                  console.error("Invalid authType provided:", authType);
                  return null;
              }
    
              if (!response) {
                console.error("No response received for authType:", authType);
                return null;
              }
    
              return response; 
            } catch (error) {
              console.error("Error in getUserData:", error);
              throw error;
            }
          },
          fetchWalletData: async (userId: string)=> {
            const { authType } = get();
            if (!authType) return; 
          
            try {
              let response;
              switch (authType) {
                case "user":
                  response = await userService.fetchWalletData(userId);
                  break;
                case "owner":
                  response = await ownerService.fetchWalletData(userId);
                  break;
                default:
                  return; 
              }
              return response;
            } catch (error) {
              console.error("Error checking user status", error);
            }
          },
 
        listAllUsers: async (page:number,limit:number,searchQuery:string) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllUsers({page,limit,searchQuery});
        } catch (error) {
          console.error("Failed to list users", error);
          throw error;
        }
      },
    
      updateUserStatus: async (userId, currentStatus) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.updateUserStatus(userId, currentStatus);
        } catch (error) {
          console.error("Failed to update users", error);
          throw error;
        }
      },
      updateUser: async (userId, formData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as owner");
          return await userService.updateuser(userId, formData);
        } catch (error) {
          console.error("Failed to update Owner", error);
          throw error;
        }
      },
      updateOwner: async (ownerId, formData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "owner")
            throw new Error("Not authorized as owner");

          return await ownerService.updateOwner(ownerId, formData);
        } catch (error) {
          console.error("Failed to update Owner", error);
          throw error;
        }
      },

   
      listAllOwners: async (page:number,limit:number,searchTerm:string) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllOwners({page,limit,searchTerm});
        } catch (error) {
          console.error("Failed to list owners", error);
          throw error;
        }
      },
      
            updateOwnerStatus: async (ownerId, currentStatus) => {
              try {
                const { authType } = get();
                if (!authType || authType !== "admin"){
                  throw new Error("Not authorized as admin");
                }
                return await adminService.updateOwnerStatus(ownerId, currentStatus);
              } catch (error) {
                console.error("Update service status failed", error);
                throw error;
              }
            },
           
       
        
      
            approveOwner: async (ownerId) => {
              try {
                const { authType } = get();
                if (!authType || authType !== "admin")
                  throw new Error("Not authorized as admin");
                return await adminService.approveOwner(ownerId);
              } catch (error) {
                console.error("unblock owner failed", error);
                throw error;
              }
            },
            
      rejectOwner: async (id, rejectionReason) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.rejectOwner(id, rejectionReason);
        } catch (error) {
          console.error("reject owner failed", error);
          throw error;
        }
      },
   

      deleteUser: async (id, authType) => {
        try {
           let response;

          switch (authType) {
            
            case "owner":
            response = await adminService.deleteOwner(id);
              break;
            default:
              throw new Error("Invalid auth type");
          }
          return response;
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },
    
    

   

})