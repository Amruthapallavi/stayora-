import { IFeature } from "../../types/feature";
import {  IBookingDetailsResponse } from "../../types/booking";
import { OwnersResponse } from "../../types/owner";
import { IProperty, IPropertyDetails } from "../../types/property";
import { adminApi } from "../api";

export const adminService = {
  getDashboardData: async () => {
    const response = await adminApi.get("/dashboard");
    return response.data;
  },
  listAllUsers: async ({
    page,
    limit,
    searchQuery,
  }: {
    page: number;
    limit: number;
    searchQuery: string;
  }) => {
    const response = await adminApi.get(
      `/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
        searchQuery
      )}`
    );
    return response.data;
  },
  listAllBookings: async () => {
    const response = await adminApi.get("/bookings");
    return response.data;
  },
  updateUserStatus: async (id: string, currentStatus: string) => {
    const response = await adminApi.patch(`/users/status/${id}`, {
      status: currentStatus,
    });

    return response.data;
  },
  bookingDetails: async (id: string): Promise<IBookingDetailsResponse> => {
    const response = await adminApi(`/bookings/${id}`);
    return response.data;
  },

  listAllOwners: async ({
    page,
    limit,
    searchTerm,
  }: {
    page: number;
    limit: number;
    searchTerm: string;
  }): Promise<OwnersResponse> => {
    const response = await adminApi.get(
      `/owners?page=${page}&limit=${limit}&search=${encodeURIComponent(
        searchTerm
      )}`
    );

    return response.data;
  },
  addService: async (serviceData: any) => {
    const response = await adminApi.post("/add-service", serviceData);
    return response.data;
  },
  listServices: async () => {
    const response = await adminApi.get("/services");
    return response.data;
  },
  updateServiceStatus: async (serviceId: string, currentStatus: string) => {
    const response = await adminApi.patch(`/services/status/${serviceId}`, {
      status: currentStatus,
    });
    return response.data;
  },
  updateFeature: async (id: string, newFeature: Partial<IFeature>) => {
    const response = await adminApi.patch(`/features/${id}`, {
      data: newFeature,
    });
    return response.data;
  },
  listFeatures: async () => {
    const response = await adminApi.get("/features");
    console.log(response,"features from admin")
    return response.data.features;
  },
  addFeature: async (featureData: any) => {
    const response = await adminApi.post("/add-feature", featureData);
    return response.data;
  },
  updateOwnerStatus: async (id: string, currentStatus: string) => {
    const response = await adminApi.patch(`/owners/status/${id}`, {
      status: currentStatus,
    });
    return response.data;
  },
  approveOwner: async (id: string) => {
    const response = await adminApi.patch(`/owners/approve/${id}`);
    return response.data;
  },
  rejectOwner: async (id: string, rejectionReason: string) => {
    const response = await adminApi.patch(`/owners/reject/${id}`, {
      reason: rejectionReason,
    });
    return response.data;
  },
  rejectProperty: async (id: string, reason: string) => {
    const response = await adminApi.patch(`/properties/reject/${id}`, {
      reason: reason,
    });
    return response.data;
  },

  deleteOwner: async (id: string) => {
    const response = await adminApi.post(`/owners/delete/${id}`);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await adminApi.post(`/users/delete/${id}`);
    return response.data;
  },
  removeFeature: async (id: string) => {
    const response = await adminApi.post(`/features/delete/${id}`);
    return response.data;
  },
  getPropertyById: async (id: string): Promise<IPropertyDetails> => {
    const response = await adminApi(`/property/${id}`);
    return response.data;
  },
  getAllProperties: async (
  page: number,
  limit: number,
  search: string
): Promise<IProperty> => {
  const response = await adminApi.get(
    `/all-Properties?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  console.log(response, "for pro");
  return response.data;
},


  approveProperty: async (id: string) => {
    const response = await adminApi.patch(`/properties/approve/${id}`);
    return response.data;
  },
  blockUnblockProperty: async (id: string, newStatus: string) => {
    const response = await adminApi.patch(`/properties/status/${id}`, {
      status: newStatus,
    });
    return response.data;
  },
  deleteProperty: async (id: string) => {
    const response = await adminApi.delete(`/properties/${id}`);
    return response.data;
  },
};
