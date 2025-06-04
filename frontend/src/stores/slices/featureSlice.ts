import { StateCreator } from 'zustand';
import { AppState, featureState } from '../../types/storeTypes';
import { adminService } from '../../api/services/adminService';
import { ownerService } from '../../api/services/ownerService';

export const createFeatureSlice: StateCreator<AppState, [], [], featureState> = (_set, get) => ({

       listAllFeatures: async () => {
        try {
          const { authType } = get();
          if (!authType) {
            throw new Error("Not authorized");
          }

          if (authType === "admin") {
            return await adminService.listFeatures();
          } else if (authType === "owner") {
            return await ownerService.listFeatures();
          } else {
            throw new Error("Invalid user type");
          }
        } catch (error) {
          console.error("Failed to list features", error);
          throw error;
        }
      },

      addFeature: async (featureData) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.addFeature(featureData);
        } catch (error) {
          console.error("Failed to add service ", error);
          throw error;
        }
      },
      removeFeature: async (featureId) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");

          return await adminService.removeFeature(featureId);
        } catch (error) {
          console.error("Failed to remove feature ", error);
          throw error;
        }
      },
      editFeature: async (featureId, newFeature) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "admin")
            throw new Error("Not authorized as admin");
          return await adminService.updateFeature(featureId, newFeature);
        } catch (error) {
          console.error("Failed to update users", error);
          throw error;
        }
      },


})