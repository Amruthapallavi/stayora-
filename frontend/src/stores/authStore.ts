import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "../api/api";

type AuthType = "user" | "owner" | "admin";

interface AuthState {
  user: any | null;
  authType: AuthType | null;
  isAuthenticated: boolean;

  login: (email: string, password: string, authType: AuthType) => Promise<void>;
  signup: (userData: any, authType: AuthType) => Promise<void>;
  // forgotPassword:(email:string,authType:AuthType)=> Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authType: sessionStorage.getItem("auth-type") as AuthType | null,
      isAuthenticated: false,

      login: async (email, password, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userLogin({ email, password });
              break;
            case "owner":
              response = await authService.ownerLogin({ email, password });
              break;
            case "admin":
              response = await authService.adminLogin({ email, password });
              break;
          }

          sessionStorage.setItem("auth-type", authType);

          set({
            user: response.user,
            authType,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },

      signup: async (userData, authType) => {
        try {
          let response;
          switch (authType) {
            case "user":
              response = await authService.userSignup(userData);
              break;
            case "owner":
              response = await authService.ownerSignup(userData);
              break;
            default:
              throw new Error("Invalid signup type");
          }

          return response;
        } catch (error) {
          console.error("Signup failed", error);
          throw error;
        }
      },



      // forgotPassword: async (email, authType) => {
      //   try {
      //     let response;
      //     switch (authType) {
      //       case "user":
      //         response = await authService.userForgotPassword({ email });
      //         break;
      //       case "owner":
      //         response = await authService.OwnerForgotPassword({ email });
      //         break;
      //       case "admin":
      //         response = await authService.adminForgotPassword({ email });
      //         break;
      //     }


          
      //   } catch (error) {
      //     console.error("error", error);
      //     throw error;
      //   }
      // },


      logout: async () => {
        try {
          const { authType } = get();
          if (!authType) throw new Error("No auth type found");

          switch (authType) {
            case "user":
              await authService.userLogout();
              break;
            case "owner":
              await authService.ownerLogout();
              break;
            case "admin":
              await authService.adminLogout();
              break;
            default:
              throw new Error("Invalid auth type");
          }

          sessionStorage.removeItem("auth-type");

          set({
            user: null,
            authType: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Logout failed", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);