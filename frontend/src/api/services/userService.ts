import { userApi } from "../api";
import { IUser } from "../../types/user";
import {  IPropertyDetails } from "../../types/property";
import {  IBookingDetailsResponse, IBookingResponse } from "../../types/booking";
import { IServiceResponse } from "../../types/service";
import { WalletData } from "../../types/wallet";
import { IReviewResponse } from "../../types/response";

export const userService = {
  getAllProperties: async (page:number,limit:number): Promise<any> => {
    const response = await userApi.get(`/all-Properties?page=${page}&limit=${limit}`);
    return response.data;
  },
  getPropertyById: async (id: string): Promise<IPropertyDetails> => {
    const response = await userApi.get(`/property/${id}`);
    return response.data;
  },
  filteredProperties: async (data: any): Promise<any> => {
    const queryParams = new URLSearchParams(data).toString();

    const response = await userApi.get(`/property/filtered?${queryParams}`);
    return response.data;
  },
  locationProperties:async (): Promise<any> => {
    const response = await userApi.get("/loc-properties");
    return response.data;
  },
  getConversation: async (sender: string, receiver: string): Promise<any> => {
    const response = await userApi.get("/conversation", {
      params: { sender, receiver },
    });
    return response.data;
  },

  markMessageAsRead: async (convId: string, userId: string): Promise<any> => {
    const response = await userApi.patch("/messages/mark-as-read", {
      params: { convId, userId },
    });
    return response.data;
  },
 submitReview: async (
  bookingId: string,
  reviewRate: number,
  reviewText: string
): Promise<void> => {
 const response= await userApi.post("/reviews", {
    bookingId,
    rating: reviewRate,
    reviewText,
  });
  return response.data;
},
  listConversations: async (): Promise<any[]> => {
    const response = await userApi.get("/conversations", {});
    return response.data.data;
  },
  saveBookingDates: async (
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    propertyId: string
  ): Promise<void> => {
    const response = await userApi.post("/checkout/save-booking-dates", {
      moveInDate,
      rentalPeriod,
      endDate,
      propertyId,
    });
    return response.data;
  },
  fetchWalletData: async (id: string): Promise<WalletData > => {
    const response = await userApi.get(`/wallet/${id}`);
    return response.data;
  },

  getReviews: async ( propertyId: string): Promise<IReviewResponse> => {
    const response = await userApi.get(`/reviews/${propertyId}`);
    return response.data;
  },
  saveAddOns: async (addOns: string[], propertyId: string): Promise<void> => {
    const response = await userApi.post("/checkout/save-addons", {
      addOns,
      propertyId,
    });
    return response.data;
  },
  getUserBookings: async (
    page: number = 1,
    limit: number = 5
  ): Promise<IBookingResponse> => {
    const response = await userApi.get(`/bookings?page=${page}&limit=${limit}`);
    return response.data;
  },
  updateuser: async (id: string, formData: Partial<IUser>) => {
    const response = await userApi.patch(`/profile/${id}`, { data: formData });
    return response.data;
  },

  sendMessage: async (data: {
    userId: string;
    receiverId: string;
    propertyId: string;
    content: string;
    room: any;
    image:string;
  }) => {
    
    const res = await userApi.post("/message", data,{
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getCartDetails: async (id: string): Promise<any> => {
    const response = await userApi.get(`/checkout/${id}`);
    return response.data;
  },
  changePassword: async (data: {
    userId: string;
    oldPass: string;
    newPass: string;
  }): Promise<any> => {
    const response = await userApi.patch(`/change-password/${data.userId}`, {
      oldPassword: data.oldPass,
      newPassword: data.newPass,
    });

    return response.data;
  },
  bookingDetails: async (id: string): Promise<IBookingDetailsResponse> => {
    const response = await userApi.get(`bookings/${id}`);
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    const response = await userApi.delete("/cart/clear");
    return response.data;
  },
  listServices: async (): Promise<IServiceResponse> => {
    const response = await userApi.get("/services");
    return response.data;
  },
  getUserData: async (id: string): Promise<{ user: IUser }> => {
    const response = await userApi.get(`/profile/${id}`);
    return response.data;
  },
  cancelBooking: async (id: string, reason: string): Promise<any> => {
    const response = await userApi.post(`/bookings/cancel/${id}`, { reason });
    return response.data;
  },
};
