// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { IUser, IUserResponse } from "./user";
// import {
//   RazorpayOrderResponse,
//   RazorpayVerifyResponse,
// } from "./razorPay";
// import { userService } from "../api/services/userService";
// import { authService } from "../api/services/authService";
// import { adminService } from "../api/services/adminService";
// import { ownerService } from "../api/services/ownerService";
// import { razorpayService } from "../api/services/paymentService";
// import { IOwner, OwnersResponse } from "./owner";
// import { notificationService } from "../api/services/notificationService";
// import { IProperty, IPropertyDetails, PropertyFormData, PropertyResponse } from "./property";
// import { IService, IServiceResponse } from "../types/service";
// import { IFeature, IFeatureResponse } from "../types/feature";
// import { ICart } from "../types/cart";
// import { IBooking, IBookingAdminResponse, IBookingDetailedData, IBookingList, IBookingResponse, IOwnerBookingDetails, IOwnerBookingRes } from "./booking";
// import { INotification } from "../types/notification";
// import { IAdminDashboardData } from "../types/admin";
// import { IResponse } from "./response";

// type AuthType = "user" | "owner" | "admin";

// interface AuthState {
//   user: any | null;
//   authType: AuthType | null;
//   isAuthenticated: boolean;

//   login: (email: string, password: string, authType: AuthType) => Promise<void>;
//   signup: (userData: IUser |IOwner , authType: AuthType) => Promise<void>;
//   verifyOtp: (email: string, otp: string, authType: AuthType) => Promise<void>;
//   resendOtp: (email: string, authType: AuthType) => Promise<void>;
//   forgotPassword: (email: string, authType: AuthType) => Promise<void>;
//   resetPassword: (
//     email: string,
//     newPassword: string,
//     authType: AuthType
//   ) => Promise<void>;
//   getUserData: (id: any, authType: AuthType) => Promise<any>;
//   updateOwner: (id: string, formData: Partial<IOwner>) => Promise<void>;
//   updateUser: (id: any, formData: IUser) => Promise<void>;
//   changePassword: (data: {
//     userId: string;
//     oldPass: string;
//     newPass: string;
//   }) => Promise<void>;
//   // forgotPassword:(email:string,authType:AuthType)=> Promise<void>;
//   listAllUsers: () => Promise<IUserResponse>;
//   updateUserStatus: (userId: string, currentStatus: string) => Promise<void>;
//   updateOwnerStatus: (ownerId: string, currentStatus: string) => Promise<IResponse>;
//   deleteUser: (userId: string, authType: AuthType) => Promise<void>;
//   approveOwner: (ownerId: string) => Promise<void>;
//   addService: (serviceData: Partial<IService>, authType: AuthType) => Promise<void>;
//   addFeature: (featureData: Partial<IFeature>, authType: AuthType) => Promise<void>;
//   removeFeature: (featureId: string) => Promise<void>;
//   editFeature: (featureId: string, newFeature:Partial<IFeature>) => Promise<void>;
//   listServices: () => Promise<IServiceResponse>;
//   listAllFeatures: () => Promise<IFeatureResponse>;
//   addProperty: (propertyData:FormData) => Promise<void>;
//   updateServiceStatus: (sericeId: string, currentStatus: string) => Promise<void>;
//   listAllOwners: () => Promise<OwnersResponse>;
//   setUserFromToken: (token: string, authType: AuthType) => void;
//   getProperties: () => Promise<IProperty |[]>;
//   updateProperty:(propertyId:string,formData:IProperty)=>Promise<void>;
//   getAllProperties: (page?:number) => Promise<PropertyResponse>;
//   getUserStatus: (userId: string) => Promise<void>;
//   rejectProperty: (propertyId: string, reason: string) => Promise<IResponse>;
//   rejectOwner: (ownerId:string, rejectionReason: string) => Promise<void>;
//   logout: () => void;
//   // getuserById(id:string):Promise<any>;
//   saveBookingDates(
//     moveInDate: Date,
//     rentalPeriod: number,
//     endDate: Date,
//     propertyId: string
//   ): Promise<void>;
//   saveAddOns(addOns: string[], propertyId: string): Promise<void>;
//   getPropertyById(propertyId: String): Promise<IPropertyDetails>;
//   deletePropertyById(propertyId: String): Promise<IResponse>;

//   getCartDetails(id: string): Promise<ICart>;
//   clearCart(): Promise<void>;
//   userBookings: (currentPage:number) => Promise<IBookingResponse>;
//   listAllBookings: () => Promise<IBookingAdminResponse>;
//   approveProperty: (propertyId: string) => Promise<IResponse>;
//   blockUnblockProperty: (propertyId: string, newStatus: string) => Promise<void>;
//   deleteProperty: (propertyId: string) => Promise<void>;

//   ownerPropertyBookings: (ownerId: string) => Promise<IOwnerBookingRes>;
//   cancelBooking: (bookingId: string, reason: string) => Promise<IResponse>;
//   bookingDetails: (bookingId: string) => Promise<IBookingDetailedData | IOwnerBookingDetails>;
//   createRazorpayOrder: (
//     amount: number,
//     productId: string
//   ) => Promise<RazorpayOrderResponse>;
//   verifyRazorpayOrder: (paymentData: any) => Promise<RazorpayVerifyResponse>;
//   sendMessage: (data: any) => Promise<any>;
//   getConversation: (sender: string, receiver: string) => Promise<any>;
//   listConversations: () => Promise<any>;
//   fetchWalletData: (userId: string) => Promise<void>;
//   filteredProperties:(data:any)=>Promise<any>;
//   getNotifications: () => Promise<INotification>;
//   markMessagesAsRead:(convId:string,userId:string)=>Promise<void>;
//   markNotificationAsRead: (notificationId: string) => Promise<any>;
//   getDashboardData:()=>Promise<IAdminDashboardData>;
// }
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       authType: sessionStorage.getItem("auth-type") as AuthType | null,
//       isAuthenticated: false,

//       login: async (email, password, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userLogin({ email, password });
//               break;
//             case "owner":
//               response = await authService.ownerLogin({ email, password });
//               break;
//             case "admin":
//               response = await authService.adminLogin({ email, password });
//               break;
//           }

//           sessionStorage.setItem("auth-type", authType);
//           console.log(response);
//           set({
//             user: response.user,
//             authType,
//             isAuthenticated: true,
//           });
//         } catch (error) {
//           console.error("Login failed", error);
//           throw error;
//         }
//       },
//       getConversation: async (sender: string, receiver: string) => {
//         try {
//           const { isAuthenticated, authType } = get();

//           if (!isAuthenticated || !authType) {
//             throw new Error("Authentication required");
//           }

//           let response;

//           switch (authType) {
//             case "user":
//               response = await userService.getConversation(sender, receiver);
//               break;
//             case "owner":
//               response = await ownerService.getConversation(sender, receiver);
//               break;
//             default:
//               throw new Error("Invalid authentication type");
//           }
//           return response;
//         } catch (error) {
//           console.error("Failed to get conversation", error);
//           throw error;
//         }
//       },
//       markMessagesAsRead: async (convId: string, userId: string) => {
//         try {
//           const { isAuthenticated, authType } = get();

//           if (!isAuthenticated || !authType) {
//             throw new Error("Authentication required");
//           }

//           let response;

//           switch (authType) {
//             case "user":
//               console.log(convId,userId);
//               response = await userService.markMessageAsRead(convId, userId);
//               console.log(response,"from authstore for markAsREad")
                     
//               break;
//             case "owner":
//               response = await ownerService.markMessageAsRead(convId, userId);
//               break;
//             default:
//               throw new Error("Invalid authentication type");
//           }
//           return response;
//         } catch (error) {
//           console.error("Failed to get conversation", error);
//           throw error;
//         }
//       },
//       listConversations: async () => {
//         try {
//           const { isAuthenticated, authType } = get();
//           if (!isAuthenticated || !authType)
//             throw new Error("Authentication required");

//           let response;

//           switch (authType) {
//             case "user":
//               response = await userService.listConversations();
//               break;
//             case "owner":
//               response = await ownerService.listConversations();
//               break;
//             default:
//               throw new Error("Invalid authentication type");
//           }
//           return response; 
//         } catch (error) {
//           console.error("Failed to get conversations", error);
//           throw error;
//         }
//       },
//       getDashboardData: async () => {
//         try {
//           const { isAuthenticated, authType } = get();

//           if (!isAuthenticated || !authType) {
//             throw new Error("Authentication required");
//           }

//           let response;

//           switch (authType) {
//             case "admin":
//               response = await adminService.getDashboardData();
//               break;
//             case "owner":
//               response = await ownerService.getDashboardData();
//               break;
//             default:
//               throw new Error("Invalid authentication type");
//           }
//           console.log(response,"for sadhsd")
//           return response;
//         } catch (error) {
//           console.error("Failed to get conversation", error);
//           throw error;
//         }
//       },
//       getUserStatus: async (userId: string) => {
//         const { authType } = get();
//         if (!authType) return false;

//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.getUserById(userId);
//               break;
//             case "owner":
//               response = await authService.getOwnerById(userId);
//               break;
//             default:
//               return false;
//           }
//           return response;
//         } catch (error) {
//           console.error("Error checking user status", error);
//           return false;
//         }
//       },

//       signup: async (userData, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userSignup(userData);
//               break;
//             case "owner":
//               response = await authService.ownerSignup(userData);
//               break;
//             default:
//               throw new Error("Invalid signup type");
//           }

//           return response;
//         } catch (error) {
//           console.error("Signup failed", error);
//           throw error;
//         }
//       },

//       verifyOtp: async (email, otp, authType) => {
//         try {
//           switch (authType) {
//             case "user":
//               await authService.userVerifyOtp({ email, otp });
//               break;
//             case "owner":
//               await authService.ownerVerifyOtp({ email, otp });
//               break;
//             default:
//               throw new Error("Invalid auth type");
//           }
//         } catch (error) {
//           console.error("OTP verification failed", error);
//           throw error;
//         }
//       },
//       resendOtp: async (email, authType) => {
//         try {
//           switch (authType) {
//             case "user":
//               console.log("send function called");
//               await authService.userResendOtp(email);
//               break;
//             case "owner":
//               await authService.ownerResendOtp(email);
//               break;
//             default:
//               throw new Error("Invalid auth type");
//           }
//         } catch (error) {
//           console.error("OTP resend failed", error);
//           throw error;
//         }
//       },

//       forgotPassword: async (email, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userForgotPassword({ email });
//               break;
//             case "owner":
//               response = await authService.OwnerForgotPassword({ email });
//               break;
//             case "admin":
//               // response = await authService.adminForgotPassword({ email });
//               break;
//           }
//           console.log(response);
//           // return response.data;
//         } catch (error) {
//           console.error("error", error);
//           throw error;
//         }
//       },

//       resetPassword: async (email, newPassword, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await authService.userResetPassword({
//                 email,
//                 newPassword,
//               });
//               break;
//             case "owner":
//               response = await authService.ownerResetPassword({
//                 email,
//                 newPassword,
//               });
//               break;
//             case "admin":
//               // response = await authService.adminForgotPassword({ email });
//               break;
//           }
//           console.log(response);
//         } catch (error) {
//           console.error("error", error);
//           throw error;
//         }
//       },
//       getUserData: async (userId: string, authType: string) => {
//         try {
//           let response;

//           switch (authType) {
//             case "user":
//               response = await userService.getUserData(userId);
//               break;
//             case "owner":
//               response = await authService.getOwnerData(userId);
//               break;
//             case "admin":
//               // response = await authService.adminForgotPassword({ email });
//               break;
//             default:
//               console.error("Invalid authType provided:", authType);
//               return null;
//           }

//           if (!response) {
//             console.error("No response received for authType:", authType);
//             return null;
//           }

//           console.log("Fetched user data from auth:", response);
//           return response; // Ensure the function returns the response
//         } catch (error) {
//           console.error("Error in getUserData:", error);
//           throw error;
//         }
//       },
//       fetchWalletData: async (userId: string): Promise<void> => {
//         const { authType } = get();
//         if (!authType) return; 
      
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await userService.fetchWalletData(userId);
//               break;
//             case "owner":
//               response = await ownerService.fetchWalletData(userId);
//               break;
//             default:
//               return; 
//           }
//           return response;
//         } catch (error) {
//           console.error("Error checking user status", error);
//         }
//       },
      
//       filteredProperties: async (data: any) => {
//         const { authType } = get();
//         if (!authType) return false;

//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               response = await userService.filteredProperties(data);
//               break;
//             case "owner":
//               break;
//             default:
//               return false;
//           }
//           return response;
//         } catch (error) {
//           console.error("Error checking user status", error);
//           return false;
//         }
//       },
//       ownerPropertyBookings: async (ownerId: string) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized");

//           return await ownerService.listAllBookings(ownerId);
//         } catch (error) {
//           console.error("Failed to list owners", error);
//           throw error;
//         }
//       },
//       updateProperty: async (propertyId: string,formData:any) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized");

//           return await ownerService.updateProperty(propertyId,formData);
//         } catch (error) {
//           console.error("Failed to list owners", error);
//           throw error;
//         }
//       },
//       bookingDetails: async (bookingId: string) => {
//         const { authType } = get();
//         if (!authType) return false;
//         try {
//           let response;
//           switch (authType) {
//             case "admin":
//               console.log("checking from frontend");
//               response = await adminService.bookingDetails(bookingId);
//               break;
//             case "user":
//               response = await userService.bookingDetails(bookingId);
//               break;
//             case "owner":
//               response = await ownerService.bookingDetails(bookingId);
//               break;
//             default:
//               return [];
//           }
//           return response;
//         } catch (error) {
//           console.error("Error checking user status", error);
//           return false;
//         }
//       },
//       listAllUsers: async () => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");

//           return await adminService.listAllUsers();
//         } catch (error) {
//           console.error("Failed to list users", error);
//           throw error;
//         }
//       },
//       listAllBookings: async () => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin") {
//             throw new Error("Not authorized as admin");
//           }
//           return await adminService.listAllBookings();
//         } catch (error) {
//           console.error("Failed to list users", error);
//           throw error;
//         }
//       },
//       updateUserStatus: async (userId, currentStatus) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.updateUserStatus(userId, currentStatus);
//         } catch (error) {
//           console.error("Failed to update users", error);
//           throw error;
//         }
//       },
//       updateUser: async (userId, formData) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized as owner");
//           return await userService.updateuser(userId, formData);
//         } catch (error) {
//           console.error("Failed to update Owner", error);
//           throw error;
//         }
//       },
//       updateOwner: async (ownerId, formData) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized as owner");

//           return await ownerService.updateOwner(ownerId, formData);
//         } catch (error) {
//           console.error("Failed to update Owner", error);
//           throw error;
//         }
//       },

//       changePassword: async (data) => {
//         try {
//           const { user, authType } = get();
//           if (!user || !authType) throw new Error("Not authenticated");
//           console.log(data, "from auth");
//           switch (authType) {
//             case "user":
//               return await userService.changePassword(data);
//               break;
//             case "owner":
//               // return  await ownerService.changePassword(data);
//               break;
//             default:
//               throw new Error("Invalid auth type for password change");
//           }
//         } catch (error) {
//           console.error("Password change failed", error);
//           throw error;
//         }
//       },
//       listAllOwners: async () => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");

//           return await adminService.listAllOwners();
//         } catch (error) {
//           console.error("Failed to list owners", error);
//           throw error;
//         }
//       },
//       addProperty: async (propertyData) => {
//         try {
//           const { authType } = get();
//           console.log(authType, "for add");
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized as owner");
//           console.log(propertyData);

//           return await ownerService.addProperty(propertyData);
//         } catch (error) {
//           console.error("Error adding property:", error);
//         }
//       },

//       listServices: async () => {
//         try {
//           const { authType } = get();

//           if (!authType) {
//             throw new Error("Authorization type not found");
//           }

//           if (authType === "admin") {
//             return await adminService.listServices();
//           } else if (authType === "user") {
//             return await userService.listServices();
//           } else {
//             throw new Error("Not authorized");
//           }
//         } catch (error) {
//           console.error("Failed to list services", error);
//           throw error;
//         }
//       },

//       listAllFeatures: async () => {
//         try {
//           const { authType } = get();
//           if (!authType) {
//             throw new Error("Not authorized");
//           }

//           if (authType === "admin") {
//             return await adminService.listFeatures();
//           } else if (authType === "owner") {
//             return await ownerService.listFeatures();
//           } else {
//             throw new Error("Invalid user type");
//           }
//         } catch (error) {
//           console.error("Failed to list features", error);
//           throw error;
//         }
//       },

//       addFeature: async (featureData) => {
//         try {
//           console.log(featureData, "feature data");
//           const { authType } = get();
//           console.log(authType);
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.addFeature(featureData);
//         } catch (error) {
//           console.error("Failed to add service ", error);
//           throw error;
//         }
//       },
//       removeFeature: async (featureId) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");

//           return await adminService.removeFeature(featureId);
//         } catch (error) {
//           console.error("Failed to remove feature ", error);
//           throw error;
//         }
//       },
//       editFeature: async (featureId, newFeature) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.updateFeature(featureId, newFeature);
//         } catch (error) {
//           console.error("Failed to update users", error);
//           throw error;
//         }
//       },
//       addService: async (serviceData) => {
//         try {
//           console.log(serviceData, "from authstore");
//           const { authType } = get();
//           console.log(authType);
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");

//           return await adminService.addService(serviceData);
//         } catch (error) {
//           console.error("Failed to add service ", error);
//           throw error;
//         }
//       },
//       updateServiceStatus: async (serviceId, currentStatus) => {
//         try {
//           console.log({ serviceId, currentStatus });
//           // const { authType } = get();
//           // if (!authType || authType !== "admin")
//           //   throw new Error("Not authorized as admin");
//           return await adminService.updateServiceStatus(serviceId, currentStatus);
//         } catch (error) {
//           console.error("Update service status failed", error);
//           throw error;
//         }
//       },

//       updateOwnerStatus: async (ownerId, currentStatus) => {
//         try {
//           console.log({ ownerId, currentStatus });
//           const { authType } = get();
//           if (!authType || authType !== "admin"){
//             throw new Error("Not authorized as admin");
//           }
//           return await adminService.updateOwnerStatus(ownerId, currentStatus);
//         } catch (error) {
//           console.error("Update service status failed", error);
//           throw error;
//         }
//       },
     
//       sendMessage: async (data) => {
//         try {
//           const { authType } = get();
//           if (!authType) {
//             throw new Error("Not authorized");
//           }

//           if (authType === "admin") {
//             // return await adminService.listFeatures();
//           } else if (authType === "owner") {
//             return await ownerService.sendMessage(data);
//           } else if (authType === "user") {
//             return await userService.sendMessage(data);
//           } else {
//             throw new Error("Invalid user type");
//           }
//         } catch (error) {
//           console.error("Failed to list features", error);
//           throw error;
//         }
//       },
//       deleteProperty: async (propertyId) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.deleteProperty(propertyId);
//         } catch (error) {
//           console.error("Failed to delete property", error);
//           throw error;
//         }
//       },
//       deletePropertyById: async (propertyId: string) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized");
//           return await ownerService.deletePropertyById(propertyId);
//         } catch (error) {
//           console.error("Failed to delete property", error);
//           throw error;
//         }
//       },
//       blockUnblockProperty: async (propertyId, newStatus) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.blockUnblockProperty(propertyId, newStatus);
//         } catch (error) {
//           console.error("Failed to update property status", error);
//           throw error;
//         }
//       },
//       approveProperty: async (propertyId) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.approveProperty(propertyId);
//         } catch (error) {
//           console.error("Failed to approve property", error);
//           throw error;
//         }
//       },

//       approveOwner: async (ownerId) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.approveOwner(ownerId);
//         } catch (error) {
//           console.error("unblock owner failed", error);
//           throw error;
//         }
//       },
//       cancelBooking: async (bookinId: string, reason: string) => {
//         try {
//           const { authType } = get();
//           if (!authType) {
//             throw new Error("No user role provided");
//           }
      
//           let response;
      
//           switch (authType) {
//             case "admin":
//               // Allow action for admin
//               // response = await adminService.cancelBooking(id);  
//               // return response; 
      
//             case "owner":
//               response = await ownerService.cancelBooking(bookinId,reason);  
//               return response;
      
//             case "user":
//               response = await userService.cancelBooking(bookinId, reason);
//               return response; 
      
//             default:
//               throw new Error("Unauthorized role");
//           }
//         } catch (error) {
//           console.error("cancel booking failed", error);
//           throw error;  // Ensure you throw the error to be handled at a higher level
//         }
//       },
      
//       rejectOwner: async (id, rejectionReason) => {
//         try {
//           console.log(id);
//           const { authType } = get();
//           if (!authType || authType !== "admin")
//             throw new Error("Not authorized as admin");
//           return await adminService.rejectOwner(id, rejectionReason);
//         } catch (error) {
//           console.error("reject owner failed", error);
//           throw error;
//         }
//       },
//       rejectProperty: async (id, reason) => {
//         try {
//           console.log(id);
//           const { authType } = get();
//           if (!authType) throw new Error("Not authorized as admin");
//           return await adminService.rejectProperty(id, reason);
//         } catch (error) {
//           console.error("rejecting property failed", error);
//           throw error;
//         }
//       },

//       deleteUser: async (id, authType) => {
//         try {
//           let response;
//           switch (authType) {
//             case "user":
//               // response = await authService.deleteUser({ id });
//               break;
//             case "owner":
//               response = await adminService.deleteOwner(id);
//               break;
//             default:
//               throw new Error("Invalid auth type");
//           }
//           console.log(response);
//         } catch (error) {
//           console.error("error", error);
//           throw error;
//         }
//       },
//       getNotifications: async () => {
//         const { isAuthenticated, authType } = get();
//         if (!isAuthenticated || !authType) {
//           throw new Error("Authentication required");
//         }
//         return await notificationService.getNotifications(authType);
//       },
//       markNotificationAsRead: async (notificationId: string) => {
//         const { isAuthenticated, authType } = get();
//         if (!isAuthenticated || !authType) {
//           throw new Error("Authentication required");
//         }
//         return await notificationService.markAsRead(notificationId, authType);
//       },
//       setUserFromToken: (token, authType) => {
//         try {
//           const base64Url = token.split(".")[1];

//           const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//           const decodedPayload = JSON.parse(
//             decodeURIComponent(escape(window.atob(base64)))
//           );
//           set({
//             user: decodedPayload,
//             authType,
//             isAuthenticated: true,
//           });
//           sessionStorage.setItem("auth-type", authType);
//         } catch (error) {
//           console.error("Failed to decode token", error);
//           throw error;
//         }
//       },

//       getProperties: async () => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "owner")
//             throw new Error("Not authorized as admin");

//           return await ownerService.getProperties();
//         } catch (error) {
//           console.error("Failed to list properties", error);
//           throw error;
//         }
//       },
//       userBookings: async (page: number = 1, limit: number = 5) => {
//         try {
//           const { authType } = get();
//           if (!authType) throw new Error("Not authorized");
//           console.log(authType, "here");

//           if (authType === "user") {
//             return await userService.getUserBookings(page, limit);
//           } else if (authType === "owner") {
//             return await ownerService.getOwnerBookings(page, limit);
//           } else {
//             throw new Error("Invalid auth type");
//           }
//         } catch (error) {
//           console.error("Failed to fetch bookings/properties", error);
//           throw error;
//         }
//       },

//       getPropertyById: async (propertyId: string) => {
//         try {
//           const { authType } = get();

//           if (!authType) {
//             throw new Error("Not authorized");
//           }
//          let response;
//           if (authType === "user") {
//            response=  await userService.getPropertyById(propertyId);
//            return response;
//           }

//           if (authType === "owner") {
//             return await ownerService.getPropertyById(propertyId);
//           }

//           if (authType === "admin") {
//             return await adminService.getPropertyById(propertyId);
//           }

//           throw new Error("Unknown role");
//         } catch (error) {
//           console.error("Failed to fetch property:", error);
//           throw error;
//         }
//       },

//       getAllProperties: async (page: number = 1, limit: number = 6) => {
//         try {
//           const { authType } = get();

//           if (!authType) throw new Error("Not authorized");

//           if (authType === "user") {
//             return await userService.getAllProperties();
//           }

//           if (authType === "admin") {
//             return await adminService.getAllProperties(page, limit);
//           }

//           throw new Error("Invalid authType");
//         } catch (error) {
//           console.error("Failed to fetch properties", error);
//           throw error;
//         }
//       },
//       saveBookingDates: async (
//         moveInDate: Date,
//         rentalPeriod: number,
//         endDate: Date,
//         propertyId: string
//       ): Promise<void> => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized as user");
//           await userService.saveBookingDates(
//             moveInDate,
//             rentalPeriod,
//             endDate,
//             propertyId
//           );
//         } catch (error) {
//           console.error("Failed to save booking dates", error);
//           throw error;
//         }
//       },

//       saveAddOns: async (
//         addOns: string[],
//         propertyId: string
//       ): Promise<void> => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized as user");
//           await userService.saveAddOns(addOns, propertyId);
//         } catch (error) {
//           console.error("Failed to save add-ons", error);
//           throw error;
//         }
//       },

//       getCartDetails: async (id: string): Promise<any> => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized as user");
//           return await userService.getCartDetails(id);
//         } catch (error) {
//           console.error("Failed to get cart details", error);
//           throw error;
//         }
//       },

//       clearCart: async (): Promise<void> => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized as user");
//           await userService.clearCart();
//         } catch (error) {
//           console.error("Failed to clear cart", error);
//           throw error;
//         }
//       },
//       createRazorpayOrder: async (amount: number, productId: string) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized");
//           console.log(productId, "productId for booking");
//           // Call the API to create an order
//           const response = await razorpayService.createOrder(amount, productId);

//           return response;
//         } catch (error) {
//           console.error("Failed to create Razorpay order", error);
//           throw error;
//         }
//       },
//       verifyRazorpayOrder: async (paymentData: any) => {
//         try {
//           const { authType } = get();
//           if (!authType || authType !== "user")
//             throw new Error("Not authorized");
//           const response = await razorpayService.verifyPayment(paymentData);
//           return response;
//         } catch (error) {
//           console.error("Failed to verify Razorpay payment", error);
//           throw error;
//         }
//       },

//       logout: async () => {
//         try {
//           const { authType } = get();
//           console.log(authType);
//           if (!authType) throw new Error("No auth type found");
//           console.log(authType);
//           switch (authType) {
//             case "user":
//               await authService.userLogout();
//               break;
//             case "owner":
//               await authService.ownerLogout();
//               break;
//             case "admin":
//               await authService.adminLogout();
//               break;
//             default:
//               throw new Error("Invalid auth type");
//           }

//           sessionStorage.removeItem("auth-type");

//           set({
//             user: null,
//             authType: null,
//             isAuthenticated: false,
//           });
//         } catch (error) {
//           console.error("Logout failed", error);
//           throw error;
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => sessionStorage),
//       partialize: (state) => ({
//         user: state.user,
//         authType: state.authType,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );
