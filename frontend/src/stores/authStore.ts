import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, adminService, ownerService } from "../api/api";

type AuthType = "user" | "owner" | "admin";

interface AuthState {
  user: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;


  login: (email: string, password: string, authType: AuthType) => Promise<void>;
  signup: (userData: any, authType: AuthType) => Promise<void>;
  verifyOtp: (email: string, otp: string, authType: AuthType) => Promise<void>;
  resendOtp: (email: string, authType: AuthType) => Promise<void>;
  forgotPassword: (email: string, authType: AuthType) => Promise<void>;
  resetPassword: (
    email: string,
    newPassword: string,
    authType: AuthType
  ) => Promise<void>;
  getUserData:(id:any,authType:AuthType)=>Promise<void>;
  updateUser:(id:any,formData:string,authType:AuthType)=>Promise<void>
  // forgotPassword:(email:string,authType:AuthType)=> Promise<void>;
  listAllUsers: () => Promise<any>;
  updateUserStatus: (id: any, currentStatus: string) => Promise<void>;
  updateOwnerStatus: (id: any,currentStatus: string) => Promise<any>;
  deleteUser: (id: any, authType: AuthType) => Promise<any>;
  approveOwner: (id: any) => Promise<any>;
  addService: (serviceData: any, authType: AuthType) => Promise<void>;
  addFeature: (featureData: any, authType: AuthType) => Promise<void>;
  removeFeature:(id:any)=> Promise<void>;
  editFeature:(id:any,newFeature:string)=> Promise<void>;
  listServices: () => Promise<any>;
  listAllFeatures: () => Promise<any>;
  addProperty:(propertyData:any)=> Promise<void>
  updateServiceStatus: (id: any, currentStatus: string) => Promise<void>;
  listAllOwners: () => Promise<any>;
  setUserFromToken: (token: string, authType: AuthType) => void;

  rejectOwner:(id:any,rejectionReason:string)=> Promise<any>;
  logout: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authType: sessionStorage.getItem("auth-type") as AuthType | null,
      isAuthenticated: false,

      login: async (email, password, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userLogin({ email, password });
              break;
            case "owner":
              response = await authService.ownerLogin({ email, password });
              break;
            case "admin":
              response = await authService.adminLogin({ email, password });
              break;
          }

          sessionStorage.setItem("auth-type", authType);
          console.log(response);
          set({
            user: response.user,
            authType,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },

      signup: async (userData, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userSignup(userData);
              break;
            case "owner":
              response = await authService.ownerSignup(userData);
              break;
            default:
              throw new Error("Invalid signup type");
          }

          return response;
        } catch (error) {
          console.error("Signup failed", error);
          throw error;
        }
      },

      verifyOtp: async (email, otp, authType) => {
        try {
          switch (authType) {
            case "user":
              await authService.userVerifyOtp({ email, otp });
              break;
            case "owner":
              await authService.ownerVerifyOtp({ email, otp });
              break;
            default:
              throw new Error("Invalid auth type");
          }
        } catch (error) {
          console.error("OTP verification failed", error);
          throw error;
        }
      },
      resendOtp: async (email, authType) => {
        try {  
          switch (authType) {
            case "user":
              console.log("send function called")
              await authService.userResendOtp(email);
              break;
            case "owner":
              await authService.ownerResendOtp(email);
              break;
            default:
              throw new Error("Invalid auth type");
          }
        } catch (error) {
          console.error("OTP resend failed", error);
          throw error;
        }
      },

      forgotPassword: async (email, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userForgotPassword({ email });
              break;
            case "owner":
              response = await authService.OwnerForgotPassword({ email });
              break;
            case "admin":
              // response = await authService.adminForgotPassword({ email });
              break;
          }
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },

      resetPassword: async (email, newPassword, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userResetPassword({
                email,
                newPassword,
              });
              break;
            case "owner":
              response = await authService.ownerResetPassword({
                email,
                newPassword,
              });
              break;
            case "admin":
              // response = await authService.adminForgotPassword({ email });
              break;
          }
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },
       getUserData :async (id: string, authType: string) => {
        try {
          let response;
      
          switch (authType) {
            case "user":
              // response = await authService.getUserData(id);
              break;
            case "owner":
              response = await authService.getOwnerData(id);
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
      
          console.log("Fetched user data from auth:", response);
          return response; // Ensure the function returns the response
        } catch (error) {
          console.error("Error in getUserData:", error);
          throw error;
        }
      },
      
      listAllUsers: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllUsers();
        } catch (error) {
          console.error("Failed to list users", error);
          throw error;
        }
      },

      updateUserStatus: async (id, currentStatus) => {
        try {
          console.log({ id, currentStatus });
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.updateUserStatus(id, currentStatus);
        } catch (error) {
          console.error("Failed to update users", error);
          throw error;
        }
      },
      updateUser: async (id,formData, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              // response = await userService.updateOwner(id,formData);
              break;
            case "owner":
              response = await ownerService.updateOwner(id,formData);
              break;
            default:
              throw new Error("Invalid auth type");
          }

          return response;
        } catch (error) {
          console.error("profile updation failed", error);
          throw error;
        }
      },
      // changePassword: async (data) => {
      //   try {
      //     const { user, authType } = get();
      //     if (!user || !authType) throw new Error("Not authenticated");
    
      //     switch (authType) {
      //       case "user":
      //         // await userService.changePassword(data);
      //         break;
      //       case "owner":
      //         await ownerService.changePassword(data);
      //         break;
      //       default:
      //         throw new Error("Invalid auth type for password change");
      //     }
      //   } catch (error) {
      //     console.error("Password change failed", error);
      //     throw error;
      //   }
      // },
      listAllOwners: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.listAllOwners();
        } catch (error) {
          console.error("Failed to list owners", error);
          throw error;
        }
      },
      addProperty: async (propertyData) => {
        try {

        const { authType } = get();
        console.log(authType,"for add");
        if (!authType || authType !== "owner")
          throw new Error("Not authorized as owner");
           return await ownerService.addProperty(propertyData);
        } catch (error) {
          console.error('Error adding property:', error);
        }
      },

      listServices: async () => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.listServices();
        } catch (error) {
          console.error("failed to list services", error);
          throw error;
        }
      },


      listAllFeatures: async () => {
        try {
          const { authType } = get();
          if (!authType) {
            throw new Error("Not authorized");
          }
      
          if (authType === "admin") {
            return await adminService.listFeatures();
          } else if (authType === "owner") {
            return await ownerService.listFeatures();
          } else {
            throw new Error("Invalid user type");
          }
        } catch (error) {
          console.error("Failed to list features", error);
          throw error;
        }
      },
      

      addFeature: async (featureData) => {
        try {
          console.log(featureData, "feature data");
          const { authType } = get();
          console.log(authType);
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.addFeature(featureData);
        } catch (error) {
          console.error("Failed to add service ", error);
          throw error;
        }
      },
      removeFeature: async (id) => {
        try {
          console.log(id, "to be removed");
          const { authType } = get();
          console.log(authType);
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.removeFeature(id);
        } catch (error) {
          console.error("Failed to remove feature ", error);
          throw error;
        }
      },
      editFeature: async (id, newFeature) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.updateFeature(id, newFeature);
        } catch (error) {
          console.error("Failed to update users", error);
          throw error;
        }
      },
      addService: async (serviceData) => {
        try {
          console.log(serviceData, "from authstore");
          const { authType } = get();
          console.log(authType);
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.addService(serviceData);
        } catch (error) {
          console.error("Failed to add service ", error);
          throw error;
        }
      },
      updateServiceStatus: async (id, currentStatus) => {
        try {
          console.log({ id, currentStatus });
          // const { authType } = get();
          // if (!authType || authType !== "admin")
          //   throw new Error("Not authorized as admin");
          return await adminService.updateServiceStatus(id, currentStatus);
        } catch (error) {
          console.error("Update service status failed", error);
          throw error;
        }
      },

      updateOwnerStatus:async(id,currentStatus)=>{

        try {
          console.log({ id, currentStatus });
          // const { authType } = get();
          // if (!authType || authType !== "admin")
          //   throw new Error("Not authorized as admin");
          return await adminService.updateOwnerStatus(id, currentStatus);
        } catch (error) {
          console.error("Update service status failed", error);
          throw error;
        }
      },
      // unblockOwner: async (id) => {
      //   try {
      //     console.log(id);
      //     const { authType } = get();
      //     if (!authType || authType !== "admin")
      //       throw new Error("Not authorized as admin");
      //     return await adminService.unblockOwner(id);

      //   } catch (error) {
      //     console.error("unblock owner failed", error);
      //     throw error;
      //   }
      // },
      approveOwner: async (id) => {
        try {
          console.log(id,"from frontend for approval");
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.approveOwner(id);

        } catch (error) {
          console.error("unblock owner failed", error);
          throw error;
        }
      },
      rejectOwner: async (id,rejectionReason) => {
        try {
          console.log(id);
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.rejectOwner(id,rejectionReason);

        } catch (error) {
          console.error("unblock owner failed", error);
          throw error;
        }
      },

      deleteUser: async (id, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              // response = await authService.deleteUser({ id });
              break;
            case "owner":
              response = await adminService.deleteOwner( id );
              break;
              default:
                throw new Error("Invalid auth type");
            
          }
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },
      setUserFromToken: (token, authType) => {
        try {
          const base64Url = token.split(".")[1];
          
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const decodedPayload = JSON.parse(
            decodeURIComponent(escape(window.atob(base64)))
          );
          set({
            user: decodedPayload,
            authType,
            isAuthenticated: true,
          });
          sessionStorage.setItem("auth-type", authType);
        } catch (error) {
          console.error("Failed to decode token", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          const { authType } = get();
          console.log(authType)
          if (!authType) throw new Error("No auth type found");
          console.log(authType)
          switch (authType) {
            case "user":
              await authService.userLogout();
              break;
            case "owner":
              await authService.ownerLogout();
              break;
            case "admin":
              await authService.adminLogout();
              break;
            default:
              throw new Error("Invalid auth type");
          }

          sessionStorage.removeItem("auth-type");

          set({
            user: null,
            authType: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
