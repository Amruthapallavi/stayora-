import { CookieOptions, Request, Response } from "express";
import userService from "../services/user.service";
import { IUserController } from "./interfaces/IUserController";
import { STATUS_CODES } from "../utils/constants";
import dotenv from "dotenv";
dotenv.config();
import { injectable,inject } from "inversify";
import TYPES from "../config/DI/types";
import jwt from "jsonwebtoken";
import Property from "../models/property.model";
import bookingService from "../services/bookingService";
import { IUserService } from "../services/interfaces/IUserService";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService)
      private userService: IUserService
    
  ){}


  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.registerUser(req.body);
      console.log(req.body)
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(req.body,"reqbody")
      const result = await this.userService.verifyOTP(email, otp);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(req.body,"for resent otp")
      if (!email) {
       throw new Error("email is required");
      }

      const result = await this.userService.resendOTP(email);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password,res);
  console.log(result.refreshToken,"refreshToken")
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: Boolean(process.env.NODE_ENV === "production"),
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
        path: "/",
      });
  
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          status: result.user.status,
        },
      });
    } catch (error) {
      console.error("Login Error: ", error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  }
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/signup?error=user_not_found`);
      }
      console.log(user)
      console.log("Checking Google authentication...");
  
      const result = await this.userService.processGoogleAuth(user);
      if (!result.token) {
        console.warn("No token found, redirecting to signup/login.");
        return res.redirect(`${process.env.FRONTEND_URL}/signup?message=${encodeURIComponent(result.message)}`);
      }
  
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });
  
      console.log("Generated Token:", result.token);
  
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${result.token}`
      );
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Google Authentication Failed",
      });
    }
  }
  


  async  forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "from req.body");
  
      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email is required",
        });
        return;
      }
  
      const result = await this.userService.resendOTP(email);
    console.log(result,"from")
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  }
  
  async resetPassword(req:Request , res:Response) :Promise<void>{
    try {
      const {email,newPassword}= req.body;
      if(!email || !newPassword ){
          res.status(STATUS_CODES.BAD_REQUEST).json({
            error: "Email and password is required",
          });
          return;
        }
        const result = await this.userService.resetPassword(email,newPassword);
      res.status(result.status).json({
        message:result.message,
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
 

  }

  async getHomeData(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      console.log(error)
    }
  }
async getAllProperties(req:Request,res:Response):Promise<void>{
try {

const result = await this.userService.getAllProperties();
    console.log(result,"from user controller");
    res.status(result.status).json({
      properties: result.properties,
    });
} catch (error) {
  console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch properties",
    });
}
}
async logout(req: Request, res: Response): Promise<void> {
  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", 
    path: "/",
  };
  
  res.clearCookie("refreshToken", options);
  res.clearCookie("auth-token", options);
  res.clearCookie("token", options); 
console.log(req.cookies,"checking")
  res.status(STATUS_CODES.OK).json({
    message: "Logged out successfully",
  });
} 


  async getProfileData(req:Request, res:Response):Promise<void>{
    try {
      const id=req.params.id;
      console.log(id);
      const result = await this.userService.getProfileData(id);
      console.log(result,"from user controller");
      res.status(result.status).json({
        user: result.user,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to fetch data",
      });
    }
  }

  async saveBookingDates(req: Request, res: Response): Promise<void> {
    try {
      const { moveInDate, rentalPeriod, endDate ,propertyId} = req.body;
  
      if (!moveInDate || !rentalPeriod || !endDate) {
        res.status(400).json({ error: "Missing required booking data" });
        return;
      }
      const userId = (req as any).userId; 
      const toLocalDateString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000; // in ms
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
      };
  
      const moveInDateObj = new Date(moveInDate);
      const endDateObj = new Date(endDate);
  
      const moveInDateOnly = toLocalDateString(moveInDateObj); 
      const endDateOnly = toLocalDateString(endDateObj);
  
      await this.userService.saveBookingDates(
        new Date(moveInDateOnly),
        rentalPeriod,
        new Date(endDateOnly),
        userId,
        propertyId,
      );
  
      res.status(200).json({ message: "Booking dates saved successfully" });
  
    } catch (error) {
      console.error("Error saving booking dates:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to save booking dates",
      });
    }
  }
 async getPropertyById(req:Request,res:Response):Promise<void>{
  try {
    const id=req.params.id;
    console.log(id);
    const result = await this.userService.getPropertyById(id);
    res.status(result.status).json({
      Property: result.property,
      ownerData:result.ownerData,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch property",
    });
  }
 }
 async getCartData(req:Request,res:Response):Promise<void>{
  try {
    const userId = (req as any).userId;

    const propertyId= req.params.id;
    const result = await this.userService.getCartData(propertyId,userId);
    res.status(result.status).json({
      cartData: result.cartData,
      property:result.property,
      // ownerData:result.ownerData,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch data",
    });
  }
 }

 async listServices(req:Request, res:Response):Promise<void>{
   try {
     const result = await this.userService.listServices();
     res.status(result.status).json({
       services: result.services,
     });
   } catch (error) {
     console.error(error);
     res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
       error: error instanceof Error ? error.message : "Failed to fetch services",
     });
   }
 }

 

 async saveAddOnServices(req: Request, res: Response): Promise<any>{
  try {
    const { addOns, propertyId } = req.body;
    const userId = (req as any).userId; 

    if (!Array.isArray(addOns) || !propertyId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await this.userService.saveAddOnsForProperty(userId, propertyId, addOns);

    res.status(200).json({ message: "Add-on services saved successfully" });
  } catch (error) {
    console.error("Error saving add-ons:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error instanceof Error ? error.message : "Failed to save add-ons",
    });
  }
};



async getUserStatus(req: Request, res: Response): Promise<any> {
  try {
    const result = await this.userService.getUserStatus(req.params.id);

    if (!result.user) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({
      status: result.user.status, 
      user: result.user._id,
    });
  } catch (err) {
    console.error("Get user status failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async getUserBookings(req: Request, res: Response): Promise<any> {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this.userService.getUserBookings(userId, page, limit);

    if (!result.bookings || result.bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json({
      status: "success",
      bookings: result.bookings,
      totalPages: result.totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Get bookings failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async updateProfile(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
const formData= req.body;
    if(!id || !formData ){
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "user not found",
        });
        return;
      }
      console.log(id,"id")
      const result = await this.userService.updateProfile(id,formData);
    res.status(result.status).json({
      message:result.message,
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async cancelBooking(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
    const reason=req.body.reason;
    if(!id  ){
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "booking not found",
        });
        return;
      }
      console.log(id,"id")
      const result = await this.userService.cancelBooking(id,reason);
    res.status(result.status).json({
      message:result.message,
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async fetchWalletData(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
    if(!id  ){
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "user not found",
        });
        return;
      }
      console.log(id,"id")
      const result = await this.userService.fetchWalletData(id);
    res.status(result.status).json({
      message:result.message,
      data:result.data,
      
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async changePassword  (req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
console.log(userId);
    if (!oldPassword || !newPassword) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Both old and new passwords are required." });
      return;
    }

    const result = await this.userService.changePassword(userId, oldPassword, newPassword);

    res.status(result.status).json({ message: result.message });
  } catch (error: any) {
    console.error("Error in changePassword controller:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while changing the password.",
    });
  }
}
}
export default  UserController;