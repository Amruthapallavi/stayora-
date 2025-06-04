import { StateCreator } from 'zustand';
import { AppState, AuthState } from '../../types/storeTypes';
import { authService} from '../../api/services/authService'; 
import { userService } from '../../api/services/userService';
import { ownerService } from '../../api/services/ownerService';

export const createAuthSlice: StateCreator<AppState, [], [], AuthState> = (set, get) => ({
  user: null,
  authType: sessionStorage.getItem("auth-type") as any,
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

  getUserStatus: async (userId: string) => {
    const { authType } = get();
    if (!authType) return false;

    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.getUserById(userId);
          break;
        case "owner":
          response = await authService.getOwnerById(userId);
          break;
        default:
          return false;
      }
      return response;
    } catch (error) {
      console.error("Error checking user status", error);
      return false;
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

  verifyOtp: async (email, otp, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userVerifyOtp({ email, otp });
          break;
        case "owner":
          await authService.ownerVerifyOtp({ email, otp });
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      throw error;
    }
  },

  resendOtp: async (email, authType) => {
    try {
      switch (authType) {
        case "user":
          await authService.userResendOtp(email);
          break;
        case "owner":
          await authService.ownerResendOtp(email);
          break;
        default:
          throw new Error("Invalid auth type");
      }
    } catch (error) {
      console.error("OTP resend failed", error);
      throw error;
    }
  },

  forgotPassword: async (email, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userForgotPassword({ email });
          break;
        case "owner":
          response = await authService.OwnerForgotPassword({ email });
          break;
      }
      return response;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },

  resetPassword: async (email, newPassword, authType) => {
    try {
      let response;
      switch (authType) {
        case "user":
          response = await authService.userResetPassword({ email, newPassword });
          break;
        case "owner":
          response = await authService.ownerResetPassword({ email, newPassword });
          break;
      }
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const { authType } = get();
      if (!authType) throw new Error("Not authenticated");

      switch (authType) {
        case "user":
          return await userService.changePassword(data);
        case "owner":
          return await ownerService.changePassword(data);
          break;
        default:
          throw new Error("Invalid auth type for password change");
      }
    } catch (error) {
      console.error("Password change failed", error);
      throw error;
    }
  },
    setUserFromToken: (token, authType) => {
        try {
          const base64Url = token.split(".")[1];

           if (!base64Url) {
           throw new Error("Invalid token format");
         }
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const decodedPayload = JSON.parse(
            decodeURIComponent(escape(window.atob(base64)))
          );
          set({
            user: decodedPayload,
            authType,
            isAuthenticated: true,
          });
          sessionStorage.setItem("auth-type", authType);
        } catch (error) {
          console.error("Failed to decode token", error);
          throw error;
        }
      },
      subscribe: async (planName:string,price:number, allowedProperties:number) => {
    try {
            const { authType } = get();
      if (!authType || authType!=="owner") throw new Error("Not authenticated as owner");

       const response = await authService.subscribe(planName,price,allowedProperties);
       return response;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },
  verifySubscription: async(paymentData:any)=>{
  try {
      const { authType } = get();
      console.log(paymentData,"for")
      if (!authType || authType!=="owner") throw new Error("Not authenticated as owner");

       const response = await authService.verifySubscription(paymentData);
       return response;
  } catch (error) {
     console.error("error", error);
      throw error;
  }
  },

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
});
