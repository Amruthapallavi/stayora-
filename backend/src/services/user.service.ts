import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/IUserService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail, isValidOTP, isValidPhone } from "../utils/validators";
import ownerRepository from "../repositories/owner.repository";
import Cart,{IAddOn, ICart} from "../models/cart.model";
import mongoose, { ObjectId, Types } from "mongoose";
import Service from "../models/service.model";
import bookingRepository from "../repositories/booking.repository";
import { ChildProcess } from "child_process";

interface SignupData extends Partial<IUser> {
    confirmPassword?: string;
  }
  
  class UserService implements IUserService {
    private sanitizeUser(user: IUser) {
        
      const { password, otp, __v, ...sanitizedUser } = user.toObject();
      return sanitizedUser;
    }

   async registerUser(
    userData: SignupData
  ): Promise<{ message: string; status: number }> {
    const { name, email, password, confirmPassword, phone } = userData;
    if (!name || !email || !password || !confirmPassword ||!phone) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!isValidPhone(phone)) {
              throw new Error("Invalid Phone number");
     }
    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp,"and email",email);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await userRepository.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
      });
    return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    console.log(email,"email")
    const user = await userRepository.findByEmail(email);
    console.log(user,"user")
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (!isValidOTP(otp)) {
      throw new Error("Invalid otp");
    }
    console.log('user otp',user.otp ,"and " ,otp)
    console.log("Stored OTP Expires:", user.otpExpires?.getTime());
console.log("Current Time:", Date.now());

    if (user.otp !== otp || (user.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;

    await userRepository.update(user._id.toString(), {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });
    
    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    // if (user.isVerified) {
    //   throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    // }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    console.log(newOtp);

    user.otp = newOtp;
    user.otpExpires=otpExpires
    await userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }
  
  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    if (user.status==="Blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED_USER);
    }
    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
      expiresIn: "1h",
    });
     console.log(token,"jwt token")
    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async resetPassword(
    email:string,
    newPassword:string
  ):Promise<{ message:string; status: number}> {
    const user = await userRepository.findByEmail(email);
    if(!user){
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null; 
    user.otpExpires = null;
    user.isVerified = true; 

    await userRepository.update(user._id.toString(), user);
    return { message: MESSAGES.SUCCESS.PASSWORD_RESET, status: STATUS_CODES.OK };

  }

  async processGoogleAuth(
    profile: any
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const email = profile.email;
    let user = await userRepository.findByEmail(email);
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await userRepository.update(user._id.toString(), user);
      }
    } else {
      user = await userRepository.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        password: "",
        isVerified: true,
      });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        type: "user",
        name: user.name,
        email: user.email,
        phone: user.phone,
        // profileImage: user.profileImage,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }


async getAllProperties(): Promise<{ properties: any[]; status: number; message: string }> {
    try {
      const properties = await userRepository.findProperties();
  
      return {
        properties: properties || [], 
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        properties: [], 
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async saveBookingDates(
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    userId: string,
    propertyId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      if (!userId || !moveInDate || !rentalPeriod || !endDate || !propertyId) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Missing required booking data",
        };
      }
  
      const existingCart = await userRepository.findCart(userId);
      if (!existingCart) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart not found",
        };
      }
  console.log(existingCart,"cart")
      // Convert date to ISO date only (ignore time)
      const toLocalDateString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
      };
  
      const moveIn = new Date(toLocalDateString(moveInDate));
      const end = new Date(toLocalDateString(endDate));
  
      const selectedProperty = existingCart.properties.find((p) =>
        p.propertyId.toString() === propertyId
      );
  
      if (!selectedProperty) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found in cart",
        };
      }
  
      selectedProperty.moveInDate = moveIn;
      selectedProperty.rentalPeriod = rentalPeriod;
      selectedProperty.endDate = end;
  
      const rent = selectedProperty.rentPerMonth || 0;
      const addOnCost = selectedProperty.addOnCost || 0;
      selectedProperty.totalCost = rent * rentalPeriod + addOnCost;
  
      existingCart.totalCost = existingCart.properties.reduce(
        (sum, p) => sum + (p.totalCost || 0),
        0
      );
  
      await existingCart.save();
  
      return {
        status: STATUS_CODES.OK,
        message: "Booking dates updated successfully",
      };
    } catch (error) {
      console.error("Error saving booking dates:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

    async getProfileData(id: string): Promise<{ user: any; status: number; message: string }> {
        try {
          const user = await userRepository.getUserById(id);
      
          if (!user) {
            return {
              user: null,
              status: STATUS_CODES.NOT_FOUND,
              message: "User not found",
            };
          }
      
          return {
            user,
            status: STATUS_CODES.OK,
            message: "Successfully fetched",
          };
        } catch (error) {
          console.error("Error in getProfileData:", error);
          return {
            user: null,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: MESSAGES.ERROR.SERVER_ERROR,
          };
        }
      }
      
  

  async getPropertyById(id: string): Promise<{ property: any; ownerData: any; status: number; message: string }> {
    try {
      const property = await userRepository.findPropertyById(id);

      if (!property || property.status !== "active") {
        throw new Error("Property not available");
      }
      
      if (!property) {
        return {
          property: null,
          ownerData: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found"
        };
      }
  
      const ownerId = property.ownerId.toString(); 
      const owner = await userRepository.findOwnerById(ownerId);
  
      const ownerData = owner
      ? {
          name: owner.name,
          phone: owner.phone,
          email: owner.email
        }
      : null;
      return {
        property,
        ownerData,
        status: STATUS_CODES.OK,
        message: "Property fetched successfully"
      };
  
    } catch (error) {
      console.error("Error in getPropertyById:", error);
      return {
        property: null,
        ownerData: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }


  async getUserStatus(id: string): Promise<{
    user: any | null;
    status: number;
    message: string;
  }> {
    try {
      const user = await userRepository.findUserById(id);
  
      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }
  
      return {
        user,
        status: STATUS_CODES.OK,
        message: "User fetched successfully",
      };
    } catch (error) {
      console.error("Error in fetching user:", error);
      return {
        user: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }
  
  async getCartData(
    propertyId: string,
    userId: string
  ): Promise<{ cartData: any;property:any; status: number; message: string }> {
    try {

      
      const property = await userRepository.findPropertyById(propertyId);
  console.log(property)
      if (!property) {
        return {
          cartData: null,
          property:null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found"
        };
      }
  
      const propertyData = {
        propertyId: new mongoose.Types.ObjectId(propertyId),
        propertyName: property.title,
        propertyImages: property.images,
        location: [
          {
            latitude: property.mapLocation?.coordinates?.latitude || 0,
            longitude: property.mapLocation?.coordinates?.longitude || 0
          }
        ],
        address:property.address,
                rentPerMonth: property.rentPerMonth,
        totalCost: property.rentPerMonth,
      };
  
      console.log(propertyData)
      let cart = await userRepository.findCart(userId);
  
      if (!cart) {
        cart = new Cart({
          userId,
          properties: [propertyData],
          totalCost: property.rentPerMonth,
        });
      } else {
        const alreadyInCart = cart.properties.some(
          (item: any) => item.propertyId.toString() === propertyId
        );
        if (!alreadyInCart) {
          cart.properties.push(propertyData);
          cart.totalCost += property.rentPerMonth;
        }
      }
  
      await cart.save();
  
      return {
        cartData: cart,
        property:property,
        status: STATUS_CODES.OK,
        message: "Property added to cart"
      };
    } catch (error) {
      console.error("Error in getCartData:", error);
      return {
        cartData: null,
        property:null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{
    bookings: any[] | null;
    totalPages: number;
    status: number;
    message: string;
  }> {
    try {
      const skip = (page - 1) * limit;
  
      const [bookings, totalCount] = await Promise.all([
        bookingRepository.findBookingsByUserId(userId, skip, limit),
        bookingRepository.countUserBookings(userId),
      ]);
  
      if (!bookings || bookings.length === 0) {
        return {
          bookings: null,
          totalPages: 0,
          status: STATUS_CODES.NOT_FOUND,
          message: "No bookings found for this user",
        };
      }
  
      const totalPages = Math.ceil(totalCount / limit);
  
      return {
        bookings,
        totalPages,
        status: STATUS_CODES.OK,
        message: "Bookings fetched successfully",
      };
    } catch (error) {
      console.error("Error in getUserBookings:", error);
      return {
        bookings: null,
        totalPages: 0,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }
  
  
  
   async listServices(): Promise<{ services: any[]; status: number; message: string }> {
      try {
        const services = await userRepository.findServices();
        return {
          services:services,
          status: STATUS_CODES.OK,
          message: "successfully fetched", 
        };
      } catch (error) {
        console.error("Error in listServices:", error);
        return { 
          services: [], 
          message: MESSAGES.ERROR.SERVER_ERROR, 
          status: STATUS_CODES.INTERNAL_SERVER_ERROR 
        };
      }
    }
    

    async saveAddOnsForProperty(
      userId: string,
      propertyId: string,
      addOnIds: string[]
    ): Promise<{ status: number; message: string }> {
      try {
        if (!userId || !propertyId || !Array.isArray(addOnIds)) {
          return {
            status: STATUS_CODES.BAD_REQUEST,
            message: "Missing required data for add-ons",
          };
        }
    
        const cart = await userRepository.findCart(userId);
        if (!cart) {
          return {
            status: STATUS_CODES.NOT_FOUND,
            message: "Cart not found",
          };
        }
    
        const selectedProperty = cart.properties.find(
          (p) => p.propertyId.toString() === propertyId
        );
    
        if (!selectedProperty) {
          return {
            status: STATUS_CODES.NOT_FOUND,
            message: "Property not found in cart",
          };
        }
    
        const addOnServices = await Service.find({
          _id: { $in: addOnIds },
        });
    
        const addOnCost = addOnServices.reduce((sum, s) => sum + (s.price || 0), 0);
        const formattedAddOns: IAddOn[] = addOnServices.map((service) => ({
          serviceId: service._id as ObjectId,
          serviceName: service.name,
          serviceCost: service.price,
        }));
        
        selectedProperty.addOn = formattedAddOns; 
        selectedProperty.addOnCost = addOnCost;
    
        const rent = selectedProperty.rentPerMonth || 0;
        const rentalPeriod = selectedProperty.rentalPeriod || 1;
        selectedProperty.totalCost = rent * rentalPeriod + addOnCost;
    
        cart.totalCost = cart.properties.reduce(
          (sum, p) => sum + (p.totalCost || 0),
          0
        );
    
        await cart.save();
    
        return {
          status: STATUS_CODES.OK,
          message: "Add-on services saved successfully",
        };
      } catch (error) {
        console.error("Error saving add-ons:", error);
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Failed to save add-on services",
        };
      }
    }

     
        async updateProfile(
          id: string,
          updatedData: Record<string, any>
        ): Promise<{ message: string; status: number }> {
          try {
            if (!id) {
              return {
                message: "Invalid user ID",
                status: STATUS_CODES.BAD_REQUEST,
              };
            }
        
            const user = await userRepository.findById(id);
            console.log(user,"for updating")
            if (!user) {
              return {
                message: "User not found",
                status: STATUS_CODES.NOT_FOUND,
              };
            }
        console.log(updatedData);
            user.name=updatedData.data.name;
            user.phone=updatedData.data.phone;
            user.address=updatedData.data.address;
            await user.save();
        
            return {
              message: "Profile updated successfully",
              status: STATUS_CODES.OK,
            };
          } catch (error) {
            console.error("Error updating profile:", error);
            return {
              message: "Internal Server Error",
              status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            };
          }
        }

        
     async changePassword  (
          userId: string,
          oldPassword: string,
          newPassword: string
        ): Promise<{ status: number; message: string }> {
          try {
            const user = await userRepository.findUserById(userId);
            if (!user) {
              return {
                status: STATUS_CODES.NOT_FOUND,
                message: MESSAGES.ERROR.USER_NOT_FOUND,
              };
            }
         console.log(userId)
            const isMatch = await bcrypt.compare(oldPassword, user.password || "");
            if (!isMatch) {
              return {
                status: STATUS_CODES.BAD_REQUEST,
                message: MESSAGES.ERROR.INCORRECT_PASSWORD,
              };
            }
        
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userRepository.updateUserPassword(userId, hashedPassword);
        
            return {
              status: STATUS_CODES.OK,
              message: "Password updated successfully",
            };
          } catch (error) {
            console.error("Error in changePasswordService:", error);
            return {
              status: STATUS_CODES.INTERNAL_SERVER_ERROR,
              message: MESSAGES.ERROR.SERVER_ERROR,
            };
          }
        };
        

  
}
    export default new UserService();