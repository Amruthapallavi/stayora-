import { userApi } from "../api";
import { IUser } from "../../types/user";
import {  IProperty, IPropertyDetails, PropertyFilter, 
  // PropertyResponse 
} from "../../types/property";
import {  CancelBookingResponse, IBookingDetailsResponse, IBookingResponse } from "../../types/booking";
import { IServiceResponse } from "../../types/service";
import { WalletData } from "../../types/wallet";
import { IResponse, IReviewResponse } from "../../types/response";
import { IChatThread, IConversationResponse, IUpdateReadResponse } from "../../types/chat";
import { CartResponse } from "../../types/cart";

export const userService = {
  getAllProperties: async (page:number,limit:number): Promise< any> => {
    const response = await userApi.get(`/all-Properties?page=${page}&limit=${limit}`);
    return response.data;
  },
  getPropertyById: async (id: string): Promise<IPropertyDetails> => {
    const response = await userApi.get(`/property/${id}`);
    return response.data;
  },
    listFeatures: async () => {
      const response = await userApi.get("/features");
      return response.data.features;
    },
    getReviewByUser:async(bookingId:string):Promise<any>=>{
        const response=await userApi.get(`/booking/user-review/${bookingId}`);
        console.log(response.data,"getReviewByUser");
        return response.data;
    },
filteredProperties: async (data: PropertyFilter): Promise<IProperty[]> => {
  console.log(data,"filered fdta")
  const response = await userApi.get(`/property/filtered`, {
    params: data,
    paramsSerializer: (params) =>
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => acc.append(key, v));
          } else {
            acc.append(key, value);
          }
          return acc;
        }, new URLSearchParams())
      ).toString(),
  });

  return response.data;
},
 deleteNotification: async (notificationId:string) => {
      const response = await userApi.delete(`/notification/${notificationId}`);
      return response.data;
    },

  // locationProperties:async (): Promise<void> => {
  //   const response = await userApi.get("/loc-properties");
  //   console.log(response.data,"locationProperties");
  //   return response.data;
  // },

  getConversation: async (sender: string, receiver: string): Promise<IConversationResponse> => {
    const response = await userApi.get("/conversation", {
      params: { sender, receiver },
    });
        console.log(response.data,"get conversation user");

    return response.data;
  },

  markMessageAsRead: async (convId: string, userId: string): Promise<IUpdateReadResponse> => {
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
  listConversations: async (): Promise<IChatThread[]> => {
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

  sendMessage: async (data: FormData) => {
    
    const res = await userApi.post("/message", data,{
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getCartDetails: async (id: string): Promise<CartResponse> => {
    const response = await userApi.get(`/checkout/${id}`);

    return response.data;
  },
  changePassword: async (data: {
    userId: string;
    oldPass: string;
    newPass: string;
  }): Promise<IResponse> => {
    const response = await userApi.patch(`/change-password/${data.userId}`, {
      oldPassword: data.oldPass,
      newPassword: data.newPass,
    });
    console.log(response.data,"change password user");

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
  cancelBooking: async (id: string, reason: string): Promise<CancelBookingResponse> => {
    const response = await userApi.post(`/bookings/cancel/${id}`, { reason });

    return response.data;
  },
};
