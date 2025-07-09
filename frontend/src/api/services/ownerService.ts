// import axios from "axios";

import {  CancelBookingResponse, IBookingDetailsResponse } from "../../types/booking";
import { IChatThread, IConversationResponse, IUpdateReadResponse } from "../../types/chat";
import { IOwner } from "../../types/owner";
import {
  IProperty,
  IPropertyDetails,
  PropertyResponse,
} from "../../types/property";
import { IResponse, IReviewResponse } from "../../types/response";
import { WalletData } from "../../types/wallet";
import { ownerApi } from "../api";

export const ownerService = {
  updateOwner: async <T>(id: string, formData: Partial<T> | IOwner) => {
    const response = await ownerApi.patch(`/profile/${id}`, { data: formData });
    return response.data;
  },
  listFeatures: async () => {
    const response = await ownerApi.get("/features");
    return response.data.features;
  },
  listAllBookings: async (ownerId: string,page:number,limit:number) => {
    const response = await ownerApi.get(`/bookings?page=${page}&limit=${limit}`, { params: { ownerId } });
    return response.data;
  },
  getDashboardData: async () => {
    const response = await ownerApi.get("/dashboard");
    return response.data;
  },
  addProperty: async (propertyData: FormData) => {
    const response = await ownerApi.post("/add-property", propertyData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  getConversation: async (sender: string, receiver: string): Promise<IConversationResponse> => {
    const response = await ownerApi.get("/conversation", {
      params: { sender, receiver },
    });
    return response.data;
  },
  markMessageAsRead: async (
    convId: string,
    userId: string
  ): Promise<IUpdateReadResponse> => {
    const response = await ownerApi.patch("/messages/mark-as-read", {
      params: { convId, userId },
    });
    return response.data;
  },
   deleteNotification: async (notificationId:string) => {
        const response = await ownerApi.delete(`/notification/${notificationId}`);
        return response.data;
      },
   getReviews: async ( propertyId: string): Promise<IReviewResponse> => {
      const response = await ownerApi.get(`/reviews/${propertyId}`);
      return response.data;
    },
  changePassword: async (data: {
    userId: string;
    oldPass: string;
    newPass: string;
  }): Promise<IResponse> => {
    const response = await ownerApi.patch(`/change-password/${data.userId}`, {
      oldPassword: data.oldPass,
      newPassword: data.newPass,
    });
    return response.data;
  },
  updateProperty: async (id: string, formData: Partial<IProperty>) => {
    const response = await ownerApi.patch(`/property/update/${id}`, formData);
    return response.data;
  },
  getProperties: async (
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<PropertyResponse> => {
    const response = await ownerApi.get(
      `/get-Owner-Properties?page=${page}&limit=${limit}&search=${encodeURIComponent(
        searchQuery
      )}`
    );
    return response.data;
  },
  deletePropertyById: async (id: string) => {
    const response = await ownerApi.delete(`/delete/${id}`);
    return response.data;
  },
  getOwnerBookings: async (
    page: number = 1,
    limit: number = 5
  ): Promise<any> => {
    const response = await ownerApi.get(
      `/bookings?page=${page}&limit=${limit}`
    );
    console.log(response.data,"get owner booking any")
    return response.data;
  },
  getPropertyById: async (id: string): Promise<IPropertyDetails> => {
    const response = await ownerApi(`/property/${id}`);
    return response.data;
  },
  bookingDetails: async (id: string): Promise<IBookingDetailsResponse> => {
    const response = await ownerApi(`/bookings/${id}`);
    return response.data;
  },
  fetchWalletData: async (id: string): Promise<WalletData > => {
    const response = await ownerApi.get(`/wallet/${id}`);
    return response.data;
  },
  listConversations: async (): Promise<IChatThread[]> => {
    const response = await ownerApi.get("/conversations", {});
    return response.data.data;
  },
  sendMessage: async (data:FormData
  ) => {
    console.log(data,"that send form chat")
    const res = await ownerApi.post("/message", data ,{
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },
  cancelBooking: async (id: string, reason: string): Promise<CancelBookingResponse> => {
    const response = await ownerApi.post(`/bookings/cancel/${id}`, { reason });
    return response.data;
  },
};
