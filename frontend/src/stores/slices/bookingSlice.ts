import { StateCreator } from 'zustand';
import { AppState } from '../../types/storeTypes';
import { bookingState } from '../../types/storeTypes';
import { ownerService } from '../../api/services/ownerService';
import { adminService } from '../../api/services/adminService';
import { userService } from '../../api/services/userService';
import { paymentService } from '../../api/services/paymentService';
import { IBookingDetailsResponse } from '../../types/booking';

export const createBookingSlice: StateCreator<AppState, [], [], bookingState> = (_set, get) => ({

      ownerPropertyBookings: async (ownerId: string,page:number,limit:number) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "owner")
            throw new Error("Not authorized");

          return await ownerService.listAllBookings(ownerId,page,limit);
        } catch (error) {
          console.error("Failed to list owners", error);
          throw error;
        }
      },
    
    bookingDetails: async (bookingId: string): Promise<IBookingDetailsResponse> => {
  const { authType } = get();
  if (!authType) throw new Error("No auth type");

  let response;

  switch (authType) {
    case "admin":
      response = await adminService.bookingDetails(bookingId);
      break;
    case "user":
      response = await userService.bookingDetails(bookingId);
      break;
    case "owner":
      response = await ownerService.bookingDetails(bookingId);
      break;
    default:
      throw new Error("Invalid auth type");
  }

  if (!response) throw new Error("No response from booking service");

  return response as IBookingDetailsResponse;
},

        listAllBookings: async () => {
              try {
                const { authType } = get();
                if (!authType || authType !== "admin") {
                  throw new Error("Not authorized as admin");
                }
                return await adminService.listAllBookings();
              } catch (error) {
                console.error("Failed to list users", error);
                throw error;
              }
            },
            
      userBookings: async (page: number = 1, limit: number = 5) => {
        try {
          const { authType } = get();
          if (!authType) throw new Error("Not authorized");

          if (authType === "user") {
            return await userService.getUserBookings(page, limit);
          } else if (authType === "owner") {
            return await ownerService.getOwnerBookings(page, limit);
          } else {
            throw new Error("Invalid auth type");
          }
        } catch (error) {
          console.error("Failed to fetch bookings/properties", error);
          throw error;
        }
      },

      saveBookingDates: async (
        moveInDate: Date,
        rentalPeriod: number,
        endDate: Date,
        propertyId: string
      ): Promise<void> => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as user");
          await userService.saveBookingDates(
            moveInDate,
            rentalPeriod,
            endDate,
            propertyId
          );
        } catch (error) {
          console.error("Failed to save booking dates", error);
          throw error;
        }
      },

      saveAddOns: async (
        addOns: string[],
        propertyId: string
      ): Promise<void> => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as user");
          await userService.saveAddOns(addOns, propertyId);
        } catch (error) {
          console.error("Failed to save add-ons", error);
          throw error;
        }
      },

      getCartDetails: async (id: string): Promise<any> => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as user");
          return await userService.getCartDetails(id);
        } catch (error) {
          console.error("Failed to get cart details", error);
          throw error;
        }
      },
      payFromWallet:async (propertyId:string):Promise<any>=>{
         try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as user");
          return await paymentService.payFromWallet(propertyId);
         } catch (error) {
           console.error("Failed to book property from wallet", error);
          throw error;
         }
      },

      clearCart: async (): Promise<void> => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized as user");
          await userService.clearCart();
        } catch (error) {
          console.error("Failed to clear cart", error);
          throw error;
        }
      },
      createRazorpayOrder: async (amount: number, productId: string) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized");
          const response = await paymentService.createOrder(amount, productId);

          return response;
        } catch (error) {
          console.error("Failed to create Razorpay order", error);
          throw error;
        }
      },
      verifyRazorpayOrder: async (paymentData: any) => {
        try {
          const { authType } = get();
          if (!authType || authType !== "user")
            throw new Error("Not authorized");
          const response = await paymentService.verifyPayment(paymentData);
          return response;
        } catch (error) {
          console.error("Failed to verify Razorpay payment", error);
          throw error;
        }
      },
      
            cancelBooking: async (bookinId: string, reason: string) => {
              try {
                const { authType } = get();
                if (!authType) {
                  throw new Error("No user role provided");
                }
            
                let response;
            
                switch (authType) {
                  case "admin":
                    // Allow action for admin
                    // response = await adminService.cancelBooking(id);  
                    // return response; 
            
                  case "owner":
                    response = await ownerService.cancelBooking(bookinId,reason);  
                    return response;
            
                  case "user":
                    response = await userService.cancelBooking(bookinId, reason);
                    return response; 
            
                  default:
                    throw new Error("Unauthorized role");
                }
              } catch (error) {
                console.error("cancel booking failed", error);
                throw error;  // Ensure you throw the error to be handled at a higher level
              }
            },

})