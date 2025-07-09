import {  INotificationApiResponse } from "./notification";
import { IAdminDashboardData } from "./admin";
import { IResponse, IReviewResponse } from "./response";
import { ISignUpData, IUser, IUserResponse } from "./user";
import { IOwner, OwnersResponse } from "./owner";
import { IProperty, IPropertyDetails, PropertyFilter, PropertyResponse } from "./property";
import {
  CancelBookingResponse,
  IBookingAdminResponse,
  IBookingDetailsResponse,
  IBookingResponse,
  IOwnerBookingRes,
} from "./booking";
import { IPaymentVerificationRequest, RazorpayOrderResponse, RazorpayVerifyResponse } from "./razorPay";
import { ICart } from "./cart";
import { FeatureData, IFeature } from "./feature";
import {  IServiceData, IServiceResponse } from "./service";
import { WalletData } from "./wallet";
import { IChatThread, IConversationResponse, ISendMessageData, IUpdateReadResponse } from "./chat";

type AuthType = "user" | "owner" | "admin";

export interface AuthState {
  user: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;

  login: (email: string, password: string, authType: AuthType) => Promise<void>;
 signup: (data: ISignUpData, authType: AuthType) => Promise<IResponse>
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
  }) => Promise<IResponse>;

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
  filteredProperties: (data: PropertyFilter) => Promise<IProperty[] |[]>;
  submitReview:(bookingId:string,reviewRate:number,reviewText:string)=>Promise<void>;
  rejectProperty: (propertyId: string, reason: string) => Promise<IResponse>;
  addProperty: (propertyData: Partial<IProperty>) => Promise<IResponse>;
  getReviews:(propertyId:string)=>Promise<IReviewResponse>;
}

export interface chatState {
  sendMessage: (data: ISendMessageData) => Promise<any>;
  getConversation: (sender: string, receiver: string) => Promise<IConversationResponse>;
  listConversations: () => Promise<IChatThread[]>;
  getNotifications: () => Promise<INotificationApiResponse>;
  markMessagesAsRead: (convId: string, userId: string) => Promise<IUpdateReadResponse>;
  deleteNotification:(notificationId:string)=>Promise<IResponse>;
  markNotificationAsRead: (notificationId: string) => Promise<any>;
}

export interface bookingState {
  ownerPropertyBookings: (ownerId: string,page:number,limit:number) => Promise<IOwnerBookingRes>;
  cancelBooking: (bookingId: string, reason: string) => Promise<CancelBookingResponse>;
  bookingDetails: (
    bookingId: string
  ) => Promise<IBookingDetailsResponse>;
  createRazorpayOrder: (
    amount: number,
    productId: string
  ) => Promise<RazorpayOrderResponse>;
  verifyRazorpayOrder: (paymentData: IPaymentVerificationRequest) => Promise<RazorpayVerifyResponse>;
  saveBookingDates(
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    propertyId: string
  ): Promise<void>;
  getReviewByUser:(bookingId:string)=>Promise<any>;
  saveAddOns(addOns: string[], propertyId: string): Promise<void>;
  payFromWallet:(propertyId:string)=>Promise<any>;
  getCartDetails(id: string): Promise<ICart>;
  clearCart(): Promise<void>;
  userBookings: (currentPage: number) => Promise<IBookingResponse>;
  listAllBookings: () => Promise<IBookingAdminResponse>;
}
export interface adminState {
  getUserData: (userId: string, authType: AuthType) => Promise<any>;
  updateOwner: (ownerId: string, formData: Partial<IOwner>) => Promise<void>;
  updateUser: (userId: string, formData: Partial<IUser>) => Promise<void>;
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
    featureData: FeatureData,
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
    serviceData:IServiceData,
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
