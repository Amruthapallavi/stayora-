// import axios from "axios";

import {  IBookingDetailsResponse } from "../../types/booking";
import { IOwner } from "../../types/owner";
import {
  IProperty,
  IPropertyDetails,
  PropertyResponse,
} from "../../types/property";
import { IResponse } from "../../types/response";
import { WalletData } from "../../types/wallet";
import { ownerApi } from "../api";

export const ownerService = {
  updateOwner: async <T>(id: string, formData: Partial<T> | IOwner) => {
    const response = await ownerApi.patch(`/profile/${id}`, { data: formData });
    return response.data;
  },
  listFeatures: async () => {
    const response = await ownerApi.get("/features");
    console.log(response,"features from owner")
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
  addProperty: async (propertyData: any) => {
    const response = await ownerApi.post("/add-property", propertyData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  getConversation: async (sender: string, receiver: string): Promise<any> => {
    const response = await ownerApi.get("/conversation", {
      params: { sender, receiver },
    });
    return response.data;
  },
  markMessageAsRead: async (
    convId: string,
    userId: string
  ): Promise<IResponse> => {
    const response = await ownerApi.patch("/messages/mark-as-read", {
      params: { convId, userId },
    });
    return response.data;
  },
  changePassword: async (data: {
    userId: string;
    oldPass: string;
    newPass: string;
  }): Promise<any> => {
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
  listConversations: async (): Promise<any[]> => {
    const response = await ownerApi.get("/conversations", {});
    return response.data.data;
  },
  sendMessage: async (data: {
    userId: string;
    receiverId: string;
    propertyId: string;
    content: string;
    room: any;
  }) => {
    const res = await ownerApi.post("/message", data);
    return res.data;
  },
  cancelBooking: async (id: string, reason: string): Promise<any> => {
    const response = await ownerApi.post(`/bookings/cancel/${id}`, { reason });
    return response.data;
  },
};
