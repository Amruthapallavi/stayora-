import {  INotificationApiResponse } from "./notification";
import { IAdminDashboardData } from "./admin";
import { IResponse } from "./response";
import { IUser, IUserResponse } from "./user";
import { IOwner, OwnersResponse } from "./owner";
import { IProperty, IPropertyDetails, PropertyResponse } from "./property";
import {
  IBookingAdminResponse,
  IBookingDetailsResponse,
  IBookingResponse,
  IOwnerBookingRes,
} from "./booking";
import { RazorpayOrderResponse, RazorpayVerifyResponse } from "./razorPay";
import { ICart } from "./cart";
import { IFeature } from "./feature";
import { IService, IServiceResponse } from "./service";
import { WalletData } from "./wallet";

type AuthType = "user" | "owner" | "admin";

export interface AuthState {
  user: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;

  login: (email: string, password: string, authType: AuthType) => Promise<void>;
 signup: (data: FormData, authType: AuthType) => Promise<any>
  verifyOtp: (email: string, otp: string, authType: AuthType) => Promise<void>;
  resendOtp: (email: string, authType: AuthType) => Promise<void>;
  forgotPassword: (email: string, authType: AuthType) => Promise<void>;
  resetPassword: (
    email: string,
    newPassword: string,
    authType: AuthType
  ) => Promise<void>;

  changePassword: (data: {
    userId: string;
    oldPass: string;
    newPass: string;
  }) => Promise<void>;

  setUserFromToken: (token: string, authType: AuthType) => void;
  subscribe:(planName:string,price:number,allowedProperties:number)=>Promise<RazorpayOrderResponse>;
  verifySubscription:(paymentData: any) => Promise<any>;
  logout: () => void;
}

export interface propertyState {
  approveProperty: (propertyId: string) => Promise<IResponse>;
  blockUnblockProperty: (
    propertyId: string,
    newStatus: string
  ) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  getPropertyById(propertyId: String): Promise<IPropertyDetails>;
  deletePropertyById(propertyId: String): Promise<IResponse>;
getProperties: (page: number, limit: number, searchTerm: string) => Promise<PropertyResponse>;
updateProperty: (propertyId: string, formData: Partial<IProperty>) => Promise<void>;
  getAllProperties: (page: number,limit:number,search?:string) => Promise<PropertyResponse>;
  filteredProperties: (data: any) => Promise<any>;
  submitReview:(bookingId:string,reviewRate:number,reviewText:string)=>Promise<void>;
  rejectProperty: (propertyId: string, reason: string) => Promise<IResponse>;
  addProperty: (propertyData: FormData) => Promise<void>;
}

export interface chatState {
  sendMessage: (data: any) => Promise<any>;
  getConversation: (sender: string, receiver: string) => Promise<any>;
  listConversations: () => Promise<any>;
  getNotifications: () => Promise<INotificationApiResponse>;
  markMessagesAsRead: (convId: string, userId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<any>;
}

export interface bookingState {
  ownerPropertyBookings: (ownerId: string,page:number,limit:number) => Promise<IOwnerBookingRes>;
  cancelBooking: (bookingId: string, reason: string) => Promise<IResponse>;
  bookingDetails: (
    bookingId: string
  ) => Promise<IBookingDetailsResponse>;
  createRazorpayOrder: (
    amount: number,
    productId: string
  ) => Promise<RazorpayOrderResponse>;
  verifyRazorpayOrder: (paymentData: any) => Promise<RazorpayVerifyResponse>;
  saveBookingDates(
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    propertyId: string
  ): Promise<void>;
  saveAddOns(addOns: string[], propertyId: string): Promise<void>;

  getCartDetails(id: string): Promise<ICart>;
  clearCart(): Promise<void>;
  userBookings: (currentPage: number) => Promise<IBookingResponse>;
  listAllBookings: () => Promise<IBookingAdminResponse>;
}
export interface adminState {
  getUserData: (id: any, authType: AuthType) => Promise<any>;
  updateOwner: (id: string, formData: Partial<IOwner>) => Promise<void>;
  updateUser: (id: any, formData: Partial<IUser>) => Promise<void>;
  listAllOwners: (page:number,limit:number,searchTerm:string) => Promise<OwnersResponse>;
  listAllUsers: (page:number,limit:number,searchQuery:string) => Promise<IUserResponse>;
  updateUserStatus: (userId: string, currentStatus: string) => Promise<IResponse>;
  updateOwnerStatus: (
    ownerId: string,
    currentStatus: string
  ) => Promise<IResponse>;
  deleteUser: (userId: string, authType: AuthType) => Promise<void>;
  approveOwner: (ownerId: string) => Promise<void>;
  getUserStatus: (userId: string) => Promise<IUser |IOwner>;
  rejectOwner: (ownerId: string, rejectionReason: string) => Promise<void>;
  fetchWalletData: (userId: string) => Promise<WalletData |undefined >;
  getDashboardData: () => Promise<IAdminDashboardData>;
}
export interface featureState {
  addFeature: (
    featureData: Partial<IFeature>,
    authType: AuthType
  ) => Promise<void>;
  removeFeature: (featureId: string) => Promise<void>;
  editFeature: (
    featureId: string,
    newFeature: Partial<IFeature>
  ) => Promise<void>;
  listAllFeatures: () => Promise<IFeature[]  >;
}
export interface serviceState {
  addService: (
    serviceData: Partial<IService>,
    authType: AuthType
  ) => Promise<void>;
  listServices: () => Promise<IServiceResponse>;
  updateServiceStatus: (
    sericeId: string,
    currentStatus: string
  ) => Promise<void>;
}

export type AppState = AuthState &
  featureState &
  propertyState &
  chatState &
  bookingState &
  adminState &
  serviceState;
