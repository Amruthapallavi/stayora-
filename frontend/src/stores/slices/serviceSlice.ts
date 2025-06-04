
import { StateCreator } from 'zustand';
import { AppState, AuthState } from '../../types/storeTypes';
import { serviceState } from '../../types/storeTypes';
import { adminService } from '../../api/services/adminService';
import { userService } from '../../api/services/userService';

export const createServiceSlice: StateCreator<AppState, [], [], serviceState> = (set, get) => ({




   listServices: async () => {
        try {
          const { authType } = get();

          if (!authType) {
            throw new Error("Authorization type not found");
          }

          if (authType === "admin") {
            return await adminService.listServices();
          } else if (authType === "user") {
            return await userService.listServices();
          } else {
            throw new Error("Not authorized");
          }
        } catch (error) {
          console.error("Failed to list services", error);
          throw error;
        }
      },
         addService: async (serviceData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.addService(serviceData);
        } catch (error) {
          console.error("Failed to add service ", error);
          throw error;
        }
      },
      updateServiceStatus: async (serviceId, currentStatus) => {
        try {
          // const { authType } = get();
          // if (!authType || authType !== "admin")
          //   throw new Error("Not authorized as admin");
          return await adminService.updateServiceStatus(serviceId, currentStatus);
        } catch (error) {
          console.error("Update service status failed", error);
          throw error;
        }
      },
    })