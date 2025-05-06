import { userApi, ownerApi } from "../api";

export const notificationService = {
  getNotifications: async (role: string) => {
    if (role === "owner") {

      const response = await ownerApi.get("/notifications");
      return response.data;
    } else {
      const response = await userApi.get("/notifications");
      return response.data;
    }
  },
  markAsRead: async (notificationId: string, role: string) => {
    if (role === "owner") {
      const response = await ownerApi.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } else {
      const response = await userApi.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    }
  },
};