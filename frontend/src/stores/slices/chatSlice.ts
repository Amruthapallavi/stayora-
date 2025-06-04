import { StateCreator } from 'zustand';
import { AppState, AuthState } from '../../types/storeTypes';
import { chatState } from '../../types/storeTypes';
import { ownerService } from '../../api/services/ownerService';
import { userService } from '../../api/services/userService';
import { notificationService } from '../../api/services/notificationService';

export const createChatSlice: StateCreator<AppState, [], [], chatState> = (set, get) => ({

         sendMessage: async (data) => {
            try {
              const { authType } = get();
              if (!authType) {
                throw new Error("Not authorized");
              }
    
              if (authType === "admin") {
                // return await adminService.listFeatures();
              } else if (authType === "owner") {
                return await ownerService.sendMessage(data);
              } else if (authType === "user") {
                return await userService.sendMessage(data);
              } else {
                throw new Error("Invalid user type");
              }
            } catch (error) {
              console.error("Failed to list features", error);
              throw error;
            }
          },
            getNotifications: async () => {
        const { isAuthenticated, authType } = get();
        if (!isAuthenticated || !authType) {
          throw new Error("Authentication required");
        }
        return await notificationService.getNotifications(authType);
      },
      markNotificationAsRead: async (notificationId: string) => {
        const { isAuthenticated, authType } = get();
        if (!isAuthenticated || !authType) {
          throw new Error("Authentication required");
        }
        return await notificationService.markAsRead(notificationId, authType);
      },
      
            getConversation: async (sender: string, receiver: string) => {
              try {
                const { isAuthenticated, authType } = get();
      
                if (!isAuthenticated || !authType) {
                  throw new Error("Authentication required");
                }
      
                let response;
      
                switch (authType) {
                  case "user":
                    response = await userService.getConversation(sender, receiver);
                    break;
                  case "owner":
                    response = await ownerService.getConversation(sender, receiver);
                    break;
                  default:
                    throw new Error("Invalid authentication type");
                }
                return response;
              } catch (error) {
                console.error("Failed to get conversation", error);
                throw error;
              }
            },
            markMessagesAsRead: async (convId: string, userId: string) => {
              try {
                const { isAuthenticated, authType } = get();
      
                if (!isAuthenticated || !authType) {
                  throw new Error("Authentication required");
                }
      
                let response;
      
                switch (authType) {
                  case "user":
                    response = await userService.markMessageAsRead(convId, userId);
                           
                    break;
                  case "owner":
                    response = await ownerService.markMessageAsRead(convId, userId);
                    break;
                  default:
                    throw new Error("Invalid authentication type");
                }
                return response;
              } catch (error) {
                console.error("Failed to get conversation", error);
                throw error;
              }
            },
            listConversations: async () => {
              try {
                const { isAuthenticated, authType } = get();
                if (!isAuthenticated || !authType)
                  throw new Error("Authentication required");
      
                let response;
      
                switch (authType) {
                  case "user":
                    response = await userService.listConversations();
                    break;
                  case "owner":
                    response = await ownerService.listConversations();
                    break;
                  default:
                    throw new Error("Invalid authentication type");
                }
                return response; 
              } catch (error) {
                console.error("Failed to get conversations", error);
                throw error;
              }
            },
})